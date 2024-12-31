import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Emprunts.css';
import { getReservationsByUser, deleteReservation  } from '../services/reservationService';
import documentService from '../services/documentService';


import authService from '../services/authService';
import userService from '../services/userService';

const MesResrvations = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [reservationsData, setReservationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Charger les données utilisateur pour récupérer l'ID
    const loadUserData = async () => {
        try {
            const emailFromToken = authService.getEmailFromToken();
            const user = await userService.getUserByEmail(emailFromToken);
            setUserId(user.id);
        } catch (err) {
            setError("Impossible de récupérer les informations utilisateur.");
            console.error(err);
        }
    };

    // Charger les réservations et récupérer les titres des documents
    useEffect(() => {
        const fetchReservations = async () => {
            if (!userId) return;
            setLoading(true);
            setError(null);
            try {
                const reservations = await getReservationsByUser(userId);
    
                // Filtrer uniquement les réservations avec le statut 'ENCOURS'
                const filteredReservations = reservations.filter(reservation => reservation.reservationStatus === 'ENCOURS');
    
                // Pour chaque réservation, récupérer le titre du document
                const reservationsWithTitles = await Promise.all(
                    filteredReservations.map(async (reservation) => {
                        try {
                            const document = await documentService.getDocumentById(reservation.documentId);
                            // Récupère le document
                            return {
                                ...reservation,
                                titreDocument: document.titre || "Titre non disponible", // Ajoute le titre du document
                            };
                        } catch (err) {
                            console.error(`Erreur lors de la récupération du titre pour le document ID: ${reservation.documentId}`, err);
                            return {
                                ...reservation,
                                titreDocument: "Titre non disponible", // Valeur par défaut en cas d'erreur
                            };
                        }
                    })
                );
    
                setReservationsData(reservationsWithTitles);
            } catch (err) {
                setError('Erreur lors du chargement des réservations. Veuillez réessayer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchReservations();
    }, [userId]);
    
    // Charger les données utilisateur au premier rendu
    useEffect(() => {
        loadUserData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservationsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reservationsData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteReservation = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
            try {
                await deleteReservation(id);
                setReservationsData((prevReservations) =>
                    prevReservations.filter((reservation) => reservation.id !== id)
                );
                alert('Réservation supprimée avec succès.');
            } catch (error) {
                console.error('Erreur lors de la suppression de la réservation:', error);
                alert('Une erreur est survenue lors de la suppression. Veuillez réessayer.');
            }
        }
    };
    
    
    
    

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

    if (loading) {
        return <div className="text-center">Chargement des réservations...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Titre du Document</th>
                            <th>Date de réservation</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.titreDocument}</td>
                                <td>{reservation.dateReservation}</td>
                                <td>
                                        <span className={`badge ${getStatutClass(reservation.reservationStatus)} rounded-3`}>
                                        {reservation.reservationStatus}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteReservation(reservation.id)}
                                        className="btn btn-sm"
                                        style={{ color: 'red' }}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination justify-content-end mt-3">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                Précédent
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                Suivant
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MesResrvations;
