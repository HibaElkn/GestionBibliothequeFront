import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Emprunts.css';
import { getAllReservations } from '../services/reservationService';
import documentService from '../services/documentService'; 
import userService from '../services/userService'; 
import axios from 'axios';  // Add axios for HTTP requests

const GestionEmprunts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [reservationsData, setReservationsData] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getAllReservations();
                const reservationsWithDetails = await Promise.all(
                    data.map(async (reservation) => {
                        const document = await documentService.getDocumentById(reservation.documentId);
                        const user = await userService.getUserById(reservation.utilisateurId);
                        return {
                            ...reservation,
                            titreDocument: document.titre || "Titre non disponible", 
                            code: user?.code || "code non disponible", 
                            nomPrenom: user ? `${user.nom} ${user.prenom}` : "Nom non disponible", 
                        };
                    })
                );

                const filteredReservations = reservationsWithDetails.filter(reservation => reservation.reservationStatus === 'ACCEPTED');
                setReservationsData(filteredReservations);

                // Send filtered data to backend
                sendFilteredDataToBackend(filteredReservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);

    // Function to send filtered reservations to backend
    const sendFilteredDataToBackend = async (filteredReservations) => {
        try {
            await axios.post('/api/emprunts/saveFiltered', filteredReservations);
            console.log("Filtered data saved successfully");
        } catch (error) {
            console.error("Error saving filtered data:", error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservationsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reservationsData.length / itemsPerPage);

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

    return (
        <div className="container">
            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Nom et Prénom</th>
                            <th>Titre du Livre</th>
                            <th>Date de réservation</th>
                            <th>Statut</th>
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

export default GestionEmprunts;
