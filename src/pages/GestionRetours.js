import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { getAllEmprunts, updateStatut } from '../services/empruntService';
import documentService from '../services/documentService';

const GestionRetours = ({ onDeleteRetour, onAddRetour }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [retoursData, setRetoursData] = useState([]);
    const [filter, setFilter] = useState('tous');
    const [alertMessage, setAlertMessage] = useState('');

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
                const todayFormatted = new Date(today.toLocaleDateString()); // Ignorer l'heure

                
        
                const updatedEmprunts = await Promise.all(
                    emprunts.map(async (retour) => {
                        try {
                            const returnDate = new Date(retour.dateRetour);
                            const borrowDate = new Date(retour.dateEmprunt);
                            const returnDateFormatted = new Date(returnDate.toLocaleDateString()); // Ignorer l'heure
                            const borrowDateFormatted = new Date(borrowDate.toLocaleDateString());
                            // Comparer uniquement les dates sans tenir compte de l'heure
                            if (returnDateFormatted <= todayFormatted && retour.statut !== 'RETOURNER') {
                               // console.log('condition valiiiiiiiiide');
                                await updateStatut(retour.id, 'RETARD');
                                
                                retour.statut = 'RETARD';
                               // window.location.reload();   
                            }
                            if (borrowDateFormatted <= todayFormatted && retour.statut !== 'RETOURNER') {
                               // console.log('condition valiiiiiiiiide');
                                await documentService.changeDocumentStatus(retour.document.id, 'NOT_EXIST');
                               // const updatedEmprunts = await getAllEmprunts();
                               // setRetoursData(updatedEmprunts);
                                
                               
                            }
        
                            return { ...retour, titreDocument: retour.document.titre };
                        } catch (error) {
                            console.error(`Erreur lors de la récupération du document ${retour.documentId}`, error);
                            return { ...retour, titreDocument: 'Titre inconnu' };
                        }
                    })
                );
               
        
                setRetoursData(updatedEmprunts);
            } catch (error) {
                setAlertMessage('Erreur lors du chargement des emprunts.');
            }
        };
        

        fetchEmpruntsWithDocuments();
    }, []);

    const filteredRetours = retoursData.filter((retour) => {
        if (filter === 'tous') {
            return retour.statut === 'ATTENTE' || retour.statut === 'RETARD'; // Inclure "En cours" et "En retard"
        }
        if (filter === 'en retard') {
            return retour.statut === 'RETARD'; // Inclure uniquement "En retard"
        }
        if (filter === 'en cours') {
            return retour.statut === 'ATTENTE'; // Inclure uniquement "En cours"
        }
        return false;
    });
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRetours.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRetours.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdateStatut = async (id, documentId) => {
        try {
            await updateStatut(id, 'RETOURNER');
            const updatedEmprunt = await updateStatut(id, 'RETOURNER');

            // Mettre à jour le statut du document
          await documentService.changeDocumentStatus(documentId, 'EXIST');

            setRetoursData((prevData) =>
                prevData.map((retour) =>
                    retour.id === id ? { ...retour, statut: updatedEmprunt.statut } : retour
                )
            );
        } catch (error) {
            setAlertMessage("Erreur lors de la mise à jour du statut de l'emprunt.");
        }
    };

    const calculateRetardDuration = (dateRetour) => {
        const today = new Date();
        const returnDate = new Date(dateRetour);
        const timeDifference = today - returnDate;
        const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        return dayDifference > 0 ? dayDifference : 0;
    };

    return (
        <div className="container">
            {alertMessage && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 col-md-6 mx-auto" role="alert">
                    {alertMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

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
                                <td>{new Date(retour.dateRetour).toLocaleDateString()}</td>

                                <td>
                                    <span className={`badge ${getStatutClass(retour.statut).className} rounded-3 fs-10`}>
                                        {getStatutClass(retour.statut).statutText}
                                    </span>
                                    {retour.statut === 'RETARD' && (
                                        <span className="badge-retard bg-danger ms-2">
                                            {calculateRetardDuration(retour.dateRetour)} jour(s) de retard
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {retour.statut !== 'RETOURNER' && (
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleUpdateStatut(retour.id, retour.document.id)}
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
