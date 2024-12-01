import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Assurez-vous d'importer FontAwesome
import '../styles/Emprunts.css';
import { getAllReservations } from '../services/reservationService'; // Assurez-vous d'importer la fonction
import documentService from '../services/documentService'; // Assurez-vous d'importer la fonction pour récupérer le titre du document
import userService from '../services/userService'; // Assurez-vous d'importer la fonction pour récupérer les informations de l'utilisateur

const GestionReservations = ({ onDeleteReservation, onAddReservation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [showAddReservationPopup, setShowAddReservationPopup] = useState(false);
    const [newReservation, setNewReservation] = useState({
        code: '',
        nomPrenom: '',
        titreLivre: '',
        dateReservation: '',
        statut: 'en attente', // Valeur par défaut
    });

    const [reservationsData, setReservationsData] = useState([]); // Initialisez avec un tableau vide

    // Utilisez useEffect pour charger les réservations à partir de l'API
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getAllReservations(); // Récupérer les données via l'API
                // Ajout des titres des documents et des informations utilisateur
                const reservationsWithDetails = await Promise.all(
                    data.map(async (reservation) => {
                        try {
                            const document = await documentService.getDocumentById(reservation.documentId); // Récupère le document
                            const user = await userService.getUserById(reservation.utilisateurId); // Récupère l'utilisateur

                            return {
                                ...reservation,
                                titreDocument: document.titre || "Titre non disponible", // Ajoute le titre du document
                                code: user?.code || "code non disponible", // Ajoute le code de l'utilisateur
                                nomPrenom: user ? `${user.nom} ${user.prenom}` : "Nom non disponible", // Nom et prénom de l'utilisateur
                            };
                        } catch (err) {
                            console.error(`Erreur lors de la récupération des détails pour la réservation ID: ${reservation.id}`, err);
                            return {
                                ...reservation,
                                titreDocument: "Titre non disponible", // Valeur par défaut en cas d'erreur
                                code: "code non disponible", // Valeur par défaut pour code
                                nomPrenom: "Nom non disponible", // Valeur par défaut pour le nom
                            };
                        }
                    })
                );
                setReservationsData(reservationsWithDetails); // Mettre à jour les données des réservations avec les titres et les informations utilisateur
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
            }
        };

        fetchReservations();
    }, []); // Ce useEffect se déclenche uniquement lors du premier montage du composant

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
            code: '',
            nomPrenom: '',
            titreLivre: '',
            dateReservation: '',
            statut: 'en attente', // Réinitialise le statut à "en attente"
        }); // Réinitialise le formulaire
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
                            <th>Code</th>
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
                                <td>{reservation.code}</td> {/* Affiche code */}
                                <td>{reservation.nomPrenom}</td> {/* Affiche nom et prénom */}
                                <td>{reservation.titreDocument}</td> {/* Affichage du titre du document */}
                                <td>{reservation.dateReservation}</td>
                                <td>
                                    <span className={`badge ${getStatutClass(reservation.reservationStatus)} rounded-3`}>
                                        {reservation.reservationStatus}
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
                                        style={{ color: 'red' }} >
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
        </div>
    );
};

export default GestionReservations;
