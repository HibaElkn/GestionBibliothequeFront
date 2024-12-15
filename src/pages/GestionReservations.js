import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Emprunts.css';
import { getAllReservations, updateReservation } from '../services/reservationService';
import documentService from '../services/documentService';
import userService from '../services/userService';
import { saveEmprunt } from '../services/empruntService';

const GestionReservations = ({ onDeleteReservation, onAddReservation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [reservationsData, setReservationsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getAllReservations();
                const reservationsWithDetails = await Promise.all(
                    data.map(async (reservation) => {
                        try {
                            const document = await documentService.getDocumentById(reservation.documentId);
                            const user = await userService.getUserById(reservation.utilisateurId);

                            return {
                                ...reservation,
                                titreDocument: document.titre || "Titre non disponible",
                                code: user?.code || "Code non disponible",
                                nomPrenom: user ? `${user.nom} ${user.prenom}` : "Nom non disponible",
                            };
                        } catch (err) {
                            console.error(`Erreur lors de la récupération des détails pour la réservation ID: ${reservation.id}`, err);
                            return {
                                ...reservation,
                                titreDocument: "Titre non disponible",
                                code: "Code non disponible",
                                nomPrenom: "Nom non disponible",
                            };
                        }
                    })
                );
                setReservationsData(reservationsWithDetails);
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
            }
        };

        fetchReservations();
    }, []);

    // Gestion de la recherche
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(1); // Réinitialiser la page à 1 après une recherche
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtrage des réservations
    const filteredReservations = reservationsData.filter((reservation) => {
        const searchValue = searchTerm.toLowerCase();
        return (
            reservation.reservationStatus === 'ENCOURS' &&
            (
                reservation.code?.toLowerCase().includes(searchValue) ||
                reservation.nomPrenom?.toLowerCase().includes(searchValue) ||
                reservation.titreDocument?.toLowerCase().includes(searchValue) ||
                reservation.dateReservation?.toLowerCase().includes(searchValue)
            )
        );
    });

    // Appliquer la pagination après le filtrage
    const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatutClass = (statut) => {
        switch (statut) {
            case 'ACCEPTED':
                return 'bg-success text-white';
            case 'ENCOURS':
                return 'bg-warning text-dark';
            case 'REJECTED':
                return 'bg-danger text-white';
            default:
                return '';
        }
    };

    const handleStatutChange = async (id, newStatut, documentId) => {
        const updatedReservations = reservationsData.map(reservation =>
            reservation.id === id ? {
                ...reservation,
                reservationStatus: newStatut
            } : reservation
        );
        setReservationsData(updatedReservations);

        const updatedReservation = updatedReservations.find(reservation => reservation.id === id);

        try {
            await updateReservation(id, {
                utilisateurId: updatedReservation.utilisateurId,
                documentId: updatedReservation.documentId,
                dateReservation: updatedReservation.dateReservation,
                reservationStatus: newStatut
            });

            if (newStatut === 'ACCEPTED') {
                const dateEmprunt = updatedReservation.dateReservation;

                const emprunt = {
                    dateEmprunt: dateEmprunt,
                };

                await saveEmprunt(updatedReservation.utilisateurId, documentId, emprunt);
                await documentService.updateDocumentAvailability(documentId, false);
                console.log("Le livre a été mis à jour comme indisponible.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la réservation :", error);
        }
    };

    return (
        <div className="container">
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
            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Nom et Prénom</th>
                            <th>Titre du Livre</th>
                            <th>Date d'emprunt</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(reservation => (
                            <tr key={reservation.id}>
                                <td>{reservation.code}</td>
                                <td>{reservation.nomPrenom}</td>
                                <td>{reservation.titreDocument}</td>
                                <td>{reservation.dateReservation}</td>
                                <td>
                                    <span className={`badge ${getStatutClass(reservation.reservationStatus)} rounded-3`}>
                                        {reservation.reservationStatus}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm text-success"
                                        onClick={() => handleStatutChange(reservation.id, 'ACCEPTED', reservation.documentId)}
                                    >
                                        ✔
                                    </button>
                                    <button
                                        className="btn btn-sm text-danger"
                                        onClick={() => handleStatutChange(reservation.id, 'REJECTED', reservation.documentId)}
                                    >
                                        ✘
                                    </button>
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

export default GestionReservations;
