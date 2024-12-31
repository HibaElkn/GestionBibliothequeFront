import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { getAllEmprunts } from '../services/empruntService';
import documentService from '../services/documentService'; // Import du service

const GestionRetours = ({ onDeleteRetour, onAddRetour }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [retoursData, setRetoursData] = useState([]);
    const [filter, setFilter] = useState('tous');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const fetchEmpruntsWithDocuments = async () => {
            try {
                const emprunts = await getAllEmprunts();

                // Récupération des titres pour chaque emprunt
                const updatedEmprunts = await Promise.all(
                    emprunts.map(async (retour) => {
                        try {
                            console.log(`Fetching document with ID: ${retour.documentId}`);
                            const document = await documentService.getDocumentById(retour.document.id);
                            
                            return { ...retour, titreDocument: document.titre };
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
        if (filter === 'tous') return true;
        return retour.statut === filter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRetours.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRetours.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatutClass = (statut) => {
        switch (statut) {
            case 'retourné':
                return 'bg-success text-white';
            case 'en attente':
                return 'bg-warning text-white';
            case 'en retard':
                return 'bg-danger text-white';
            default:
                return '';
        }
    };

    const handleMarkAsReturned = (id) => {
        const updatedRetours = retoursData.map((retour) =>
            retour.id === id ? { ...retour, statut: 'retourné' } : retour
        );
        setRetoursData(updatedRetours);
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
                        <option value="en attente">En attente</option>
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
                            <th>Date d'emprunt</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((retour) => (
                            <tr key={retour.id}>
                                <td>{retour.utilisateur.code}</td>
                                <td>{retour.utilisateur.nom} {retour.utilisateur.prenom}</td>
                                <td>{retour.titreDocument}</td>
                                <td>{retour.dateEmprunt}</td>
                                <td>
                                    <span className={`badge ${getStatutClass(retour.statut)} rounded-3 fs-10`}>
                                        {retour.statut}
                                    </span>
                                    {retour.statut === 'en retard' && (
                                        <span className="badge bg-danger ms-2">
                                            {calculateRetardDuration(retour.dateRetour)} jours de retard
                                        </span>
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
