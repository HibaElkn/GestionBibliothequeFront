// components/Reservations.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Emprunts.css';

const GestionReservations = ({ reservationsData = [], onDeleteReservation, onAddReservation }) => { 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [showAddReservationPopup, setShowAddReservationPopup] = useState(false);
    const [newReservation, setNewReservation] = useState({
        cne: '',
        numSom: '',
        nomPrenom: '',
        titreLivre: '',
        dateReservation: '',
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(reservationsData) ? reservationsData.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(reservationsData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteReservation = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
            onDeleteReservation(id);
        }
    };

    const handleAddReservationChange = (e) => {
        setNewReservation({ ...newReservation, [e.target.name]: e.target.value });
    };

    const handleAddReservationSubmit = () => {
        onAddReservation(newReservation); // Appel à la fonction d'ajout
        setShowAddReservationPopup(false); // Ferme la popup
        setNewReservation({
            cne: '',
            numSom: '',
            nomPrenom: '',
            titreLivre: '',
            dateReservation: '',
        }); // Réinitialise le formulaire
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-end mb-3">
                <button 
                    onClick={() => setShowAddReservationPopup(true)} 
                    className="btn btn-primary custom-btn">
                    <i className="fas fa-plus"></i> Ajouter une réservation
                </button>
            </div>

            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>CNE / Num de Som</th>
                            <th>Nom et Prénom</th>
                            <th>Titre du Livre</th>
                            <th>Date de réservation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(reservation => (
                            <tr key={reservation.id}>
                                <td>{reservation.cne} / {reservation.numSom}</td>
                                <td>{reservation.nomPrenom}</td>
                                <td>{reservation.titreLivre}</td>
                                <td>{reservation.dateReservation}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteReservation(reservation.id)} 
                                        className="btn btn-sm" 
                                        style={{ color: 'red' }}>
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

            {showAddReservationPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Ajouter une réservation</h5>
                        <input type="text" name="cne" placeholder="CNE" onChange={handleAddReservationChange} value={newReservation.cne} />
                        <input type="text" name="numSom" placeholder="Num de Som" onChange={handleAddReservationChange} value={newReservation.numSom} />
                        <input type="text" name="nomPrenom" placeholder="Nom et Prénom" onChange={handleAddReservationChange} value={newReservation.nomPrenom} />
                        <input type="text" name="titreLivre" placeholder="Titre du Livre" onChange={handleAddReservationChange} value={newReservation.titreLivre} />
                        <input type="date" name="dateReservation" placeholder="Date de Réservation" onChange={handleAddReservationChange} value={newReservation.dateReservation} />
                        <button onClick={handleAddReservationSubmit} className="btn btn-primary custom-btn mt-2">Ajouter la réservation</button>
                        <button onClick={() => setShowAddReservationPopup(false)} className="btn btn-secondary mt-2">Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionReservations;
