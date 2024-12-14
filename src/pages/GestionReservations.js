import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Assurez-vous d'importer FontAwesome
import '../styles/Emprunts.css';
import { getAllReservations, updateReservation } from '../services/reservationService'; // Assurez-vous d'importer la fonction
import documentService from '../services/documentService'; // Assurez-vous d'importer la fonction pour récupérer le titre du document
import userService from '../services/userService'; // Assurez-vous d'importer la fonction pour récupérer les informations de l'utilisateur
import { saveEmprunt } from '../services/empruntService';


const GestionReservations = ({ onDeleteReservation, onAddReservation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
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

    // Filtrer uniquement les réservations en cours
    const currentItems = reservationsData
        .filter(reservation => reservation.reservationStatus === 'ENCOURS')
        .slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(reservationsData.filter(reservation => reservation.reservationStatus === 'ENCOURS').length / itemsPerPage);

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

    // Fonction pour mettre à jour le statut dans l'API et dans l'interface
    const handleStatutChange = async (id, newStatut, documentId) => {
        // Trouver la réservation à mettre à jour
        const updatedReservations = reservationsData.map(reservation => 
            reservation.id === id ? { 
                ...reservation, 
                reservationStatus: newStatut 
                // On ne touche pas à la dateReservation pour la garder inchangée
            } : reservation
        );
        setReservationsData(updatedReservations);
    
        // Créer un objet pour l'update, en envoyant seulement les champs nécessaires
        const updatedReservation = updatedReservations.find(reservation => reservation.id === id);
        
        // Mise à jour dans la base de données avec la date inchangée
        try {
            await updateReservation(id, {
                utilisateurId: updatedReservation.utilisateurId,
                documentId: updatedReservation.documentId,
                dateReservation: updatedReservation.dateReservation, // Ne pas changer la date
                reservationStatus: newStatut
            });

            // Si la réservation est acceptée, mettre à jour la disponibilité du livre
            if (newStatut === 'ACCEPTED') {
                // Calculer la date d'emprunt et la date de retour
                const dateEmprunt = updatedReservation.dateReservation;
              //  const dateRetour = new Date(dateEmprunt);
               // dateRetour.setDate(dateRetour.getDate() + 3); // Ajouter 3 jours à la date d'emprunt
                
                const emprunt = {
                    dateEmprunt: dateEmprunt,
                   // dateRetour: dateRetour.toISOString().split('T')[0], // Format ISO de la date de retour
                };

                await saveEmprunt(updatedReservation.utilisateurId, documentId, emprunt); // Sauvegarder l'emprunt
                await documentService.updateDocumentAvailability(documentId, false); // Mettre le livre à "indisponible"
                console.log("Le livre a été mis à jour comme indisponible.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la réservation :", error);
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
