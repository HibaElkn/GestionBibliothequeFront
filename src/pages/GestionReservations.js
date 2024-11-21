import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Assurez-vous d'importer FontAwesome
import '../styles/Emprunts.css';

const GestionReservations = ({ onDeleteReservation, onAddReservation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [showAddReservationPopup, setShowAddReservationPopup] = useState(false);
    const [newReservation, setNewReservation] = useState({
        cne: '',
        numSom: '',
        nomPrenom: '',
        titreLivre: '',
        dateReservation: '',
        statut: 'en attente', // Valeur par défaut
    });

    const [reservationsData, setReservationsData] = useState([
        {
            id: 1,
            cne: '123456',
            numSom: '7890',
            nomPrenom: 'John Doe',
            titreLivre: 'Le Grand Livre',
            dateReservation: '2024-11-20',
            statut: 'confirmé',
        },
        {
            id: 2,
            cne: '234567',
            numSom: '8901',
            nomPrenom: 'Jane Smith',
            titreLivre: 'Les Mystères de l\'univers',
            dateReservation: '2024-11-21',
            statut: 'en attente',
        },
        {
            id: 3,
            cne: '345678',
            numSom: '9012',
            nomPrenom: 'Marc Dupont',
            titreLivre: 'Le Voyage Extraordinaire',
            dateReservation: '2024-11-22',
            statut: 'refusé',
        }
    ]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservationsData.slice(indexOfFirstItem, indexOfLastItem);
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
            statut: 'en attente', // Réinitialise le statut à "en attente"
        }); // Réinitialise le formulaire
    };

    const getStatutClass = (statut) => {
        switch (statut) {
            case 'confirmé':
                return 'bg-success text-white';
            case 'en attente':
                return 'bg-warning text-dark';
            case 'refusé':
                return 'bg-danger text-white';
            default:
                return '';
        }
    };

    const handleStatutChange = (id, newStatut) => {
        const updatedReservations = reservationsData.map(reservation => 
            reservation.id === id ? { ...reservation, statut: newStatut } : reservation
        );
        setReservationsData(updatedReservations);
    };

    const [editingStatut, setEditingStatut] = useState(null); // State pour gérer quel statut est en cours d'édition

    return (
        <div className="container">
            <div className="d-flex justify-content-end mb-3">
                <button 
                    onClick={() => setShowAddReservationPopup(true)} 
                    className="btn btn-primary custom-btn"
                    style={{
                        backgroundColor: '#D99A22', 
                        color: '#004079ff',           
                        border: '1px solid #D99A22', 
                        padding: '10px 20px',       
                        borderRadius: '5px',        
                    }}>
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
                            <th>Statut</th>
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
                                    <span className={`badge ${getStatutClass(reservation.statut)} rounded-3`}>
                                        {reservation.statut}
                                    </span>
                                    
                                    <button 
                                        className="btn btn-sm btn-info ms-2" 
                                        onClick={() => setEditingStatut(reservation.id)}
                                    >
                                        <i className="fa fa-pencil-alt"></i>
                                    </button>

                                    {editingStatut === reservation.id && (
                                        <select 
                                            value={reservation.statut} 
                                            onChange={(e) => {
                                                handleStatutChange(reservation.id, e.target.value);
                                                setEditingStatut(null); 
                                            }}
                                            className="form-select form-select-sm ms-2"
                                        >
                                            <option value="confirmé">Confirmé</option>
                                            <option value="en attente">En attente</option>
                                            <option value="refusé">Refusé</option>
                                        </select>
                                    )}
                                </td>
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
                        <select name="statut" value={newReservation.statut} onChange={handleAddReservationChange} className="form-select form-select-sm">
                            <option value="en attente">En attente</option>
                            <option value="confirmé">Confirmé</option>
                            <option value="refusé">Refusé</option>
                        </select>
                        <button onClick={handleAddReservationSubmit} className="btn btn-success">Ajouter</button>
                        <button onClick={() => setShowAddReservationPopup(false)} className="btn btn-secondary">Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionReservations;
