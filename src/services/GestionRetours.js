import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { getAllEmprunts, updateStatut } from '../services/empruntService';
import documentService from '../services/documentService';
import { savePenalite } from '../services/penaliteService';

const GestionRetours = ({ onDeleteRetour, onAddRetour }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [retoursData, setRetoursData] = useState([]);
    const [filter, setFilter] = useState('tous');
    const [alertMessage, setAlertMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); 
    const getStatutClass = (statut) => {
        let statutText = '';
        let className = '';

        switch (statut) {
            case 'RETOURNER':
                statutText = 'Retourné';
                className = 'bg-success text-white';
                break;
            case 'ATTENTE':
                statutText = 'En cours';
                className = 'bg-warning text-white';
                break;
            case 'RETARD':
                statutText = 'En retard';
                className = 'bg-danger text-white';
                break;
            default:
                statutText = 'Statut inconnu';
                className = 'bg-secondary text-white';
        }

        return { statutText, className };
    };

    useEffect(() => {
        const fetchEmpruntsWithDocuments = async () => {
            try {
                const emprunts = await getAllEmprunts();
    
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to ignore hours, minutes, and seconds
    
                const updatedEmprunts = await Promise.all(
                    emprunts.map(async (retour) => {
                        try {
                            const returnDate = new Date(retour.dateRetour);
                            const borrowDate = new Date(retour.dateEmprunt);
                            returnDate.setHours(0, 0, 0, 0); // Reset time for comparison
                            borrowDate.setHours(0, 0, 0, 0);
    
                            // Vérification si la date de retour est valide
                            if (isNaN(returnDate)) {
                                console.error(`Date de retour invalide pour l'emprunt ${retour.id}`);
                                retour.dateRetour = null; // Si la date est invalide, la réinitialiser à null
                            }
    
                            // Calculate delay
                            const delay = calculateRetardDuration(returnDate);
    
                            // Update status if delay is greater than 0 and status is still 'ATTENTE'
                            if (delay > 0 && retour.statut === 'ATTENTE') {
                                try {
                                    // Only update the statut to 'RETARD', and leave the dateRetour unchanged
                                    const updatedRetour = await updateStatut(retour.id, 'RETARD');
                                    
                                    // Ensure the statut is updated in the UI, but keep the original dateRetour
                                    setRetoursData((prevData) =>
                                        prevData.map((r) =>
                                            r.id === retour.id ? {
                                                ...r,
                                                statut: updatedRetour.statut, // Only update the statut field
                                                // dateRetour remains the same (it should not be changed)
                                            } : r
                                        )
                                    );
                                } catch (error) {
                                    console.error(`Erreur lors de la mise à jour du statut de l'emprunt ${retour.id}:`, error);
                                }
                            }
                            
    
                            // Update document status if borrow date is overdue
                            if (borrowDate <= today && retour.statut !== 'RETOURNER') {
                                await documentService.changeDocumentStatus(retour.document.id, 'NOT_EXIST');
                            }
    
                            // Add document title to the retour object
                            return { ...retour, titreDocument: retour.document.titre };
                        } catch (error) {
                            console.error(`Erreur lors du traitement de l'emprunt ${retour.id}:`, error);
                            return { ...retour, titreDocument: 'Titre inconnu' };
                        }
                    })
                );
    
                // Update state with the processed emprunts
                setRetoursData(updatedEmprunts);
            } catch (error) {
                console.error('Erreur lors de la récupération des emprunts:', error);
                setAlertMessage('Erreur lors du chargement des emprunts.');
            }
        };
    
        fetchEmpruntsWithDocuments();
    }, []); // Dependency array ensures this runs only once on component mount
    
    // Helper function to calculate delay
    const calculateRetardDuration = (returnDate) => {
        const today = new Date();
        const timeDifference = today - returnDate;
        const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        const delay = dayDifference > 0 ? dayDifference : 0;
    
        return delay;
    };
      // Helper function to calculate dateRetour (dateEmprunt + 3 days)
      const calculateDateRetour = (dateEmprunt) => {
        const empruntDate = new Date(dateEmprunt);
        empruntDate.setDate(empruntDate.getDate() + 3); // Add 3 days
        return empruntDate.toLocaleDateString(); // Return the formatted date
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log('Recherche pour:', searchTerm);
    };

    const filteredRetours = retoursData.filter((retour) => {
        // Filtrage par statut (selon le filtre sélectionné)
        let statutCondition = false;
        if (filter === 'tous') {
            statutCondition = retour.statut === 'ATTENTE' || retour.statut === 'RETARD';
        } else if (filter === 'en retard') {
            statutCondition = retour.statut === 'RETARD';
        } else if (filter === 'en cours') {
            statutCondition = retour.statut === 'ATTENTE';
        }
    
        // Filtrage par recherche
        const searchCondition = (
            retour.utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            retour.utilisateur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            retour.titreDocument.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        return statutCondition && searchCondition;  // Combine les deux conditions de filtre
    });
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRetours.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRetours.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdateStatut = async (id, documentId, utilisateurId, statut, dateEmprunt) => {
        try {
            console.log("Statut reçu :", statut);
            console.log("Date emprunt reçue :", dateEmprunt);
    
            // Step 1: Check statut
            if (statut === 'RETARD') {
                // Calculate dateDebut = dateEmprunt + 3 days
                const dateDebut = new Date(dateEmprunt);
                dateDebut.setDate(dateDebut.getDate() + 3);
            
                console.log("Date début pénalité :", dateDebut);
            
                // Calculate duree = currentDate - dateDebut
                const currentDate = new Date();
                const duree = calculatePenaltyDuration(dateDebut, currentDate);
            
                console.log("Durée pénalité :", duree);
                console.log("ID utilisateur :", utilisateurId);
            
                // Prepare penalite data
                const penaliteData = {
                    utilisateur: { id: utilisateurId },  // Send utilisateur as an object with an id field
                    dateDebut: dateDebut.toISOString(),
                    duree: duree
                };
            
                console.log("Données de la pénalité à envoyer :", penaliteData);
            
                // Step 2: Call savePenalite
                console.log("Envoi des données de pénalité à savePenalite...");
                await savePenalite(penaliteData);
            }
            
            // Step 3: Update statut to 'RETOURNER'
            console.log("Mise à jour du statut en 'RETOURNER'...");
            await updateStatut(id, 'RETOURNER');
    
            // Step 4: Update document status to 'EXIST'
            console.log("Mise à jour du statut du document en 'EXIST'...");
            await documentService.changeDocumentStatus(documentId, 'EXIST');
    
            // Step 5: Update local state
            setRetoursData((prevData) =>
                prevData.map((retour) =>
                    retour.id === id ? { ...retour, statut: 'RETOURNER' } : retour
                )
            );
    
            console.log("Statut mis à jour avec succès.");
        } catch (error) {
            console.error("Erreur :", error);
    
            if (error.response && error.response.data && error.response.data.error) {
                setAlertMessage(error.response.data.error);
            } else {
                setAlertMessage("Erreur lors du traitement de l'emprunt.");
            }
        }
    };
    
    // Helper function to calculate the penalty duration (in days)
    const calculatePenaltyDuration = (dateDebut, currentDate) => {
        const timeDifference = currentDate - dateDebut; // Difference in milliseconds
        const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert to days
        return dayDifference > 0 ? dayDifference : 0; // Ensure non-negative duration
    };
    
   

    return (
        
        <div className="container">
             {alertMessage && (
            <div className="alert alert-danger alert-dismissible fade show mt-3 col-md-6 mx-auto" role="alert">
                {alertMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        )}
            {alertMessage && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 col-md-6 mx-auto" role="alert">
                    {alertMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <form className="search-container" onSubmit={handleSearchSubmit}>
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="search-bar" 
                    value={searchTerm}
                    onChange={handleSearchChange} 
                />
                <i className="fas fa-search search-icon"></i> 
            </form>
            <div className="d-flex justify-content-end mb-3">
                <div>
                    <select
                        className="form-select form-select-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="tous">Tous</option>
                        <option value="en retard">En retard</option>
                        <option value="en cours">En cours</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Nom et Prénom</th>
                            <th>Titre du Livre</th>
                            <th>Date de Retour</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((retour) => (
                            <tr key={retour.id}>
                                <td>{retour.utilisateur.code}</td>
                                <td>{retour.utilisateur.nom} {retour.utilisateur.prenom}</td>
                                <td>{retour.titreDocument}</td>
                                <td>{calculateDateRetour(retour.dateEmprunt)}</td>
                                <td>
    <span className={`badge ${getStatutClass(retour.statut).className} rounded-3 fs-10`}>
        {getStatutClass(retour.statut).statutText}
    </span>
    {retour.statut === 'RETARD' && (
         (() => {
            const currentDate = new Date();
            console.log(calculatePenaltyDuration(retour.dateEmprunt, currentDate));
            // return (
                // <span className="badge bg-danger ms-2 rounded-3 fs-10">
                //     {calculatePenaltyDuration(retour.dateRetour, currentDate)} jour(s)
                // </span>
            // );
        })()
    )}
</td>

                                <td>
    {retour.statut !== 'RETOURNER' && (
        <button
            className="btn btn-sm btn-primary"
            onClick={() =>
                handleUpdateStatut(
                    retour.id, 
                    retour.document.id, 
                    retour.utilisateur.id, 
                    retour.statut, 
                    retour.dateEmprunt
                )
            }
            style={{
                fontSize: '12px', 
                padding: '4px 8px', 
                height: 'auto', 
            }}
        >
            Confirmer le retour
        </button>
    )}
</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination justify-content-end mt-3">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Précédent</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Suivant</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GestionRetours;
