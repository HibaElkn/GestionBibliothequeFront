import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserBooks.css';
import { getEmailFromToken } from '../services/authService';
import { getUserByEmail } from '../services/userService';
import { createReservation } from '../services/reservationService';
import { fetchPenalitesByUtilisateur } from '../services/penaliteService';
import { getEmpruntsByUtilisateur } from '../services/empruntService.js';

const defaultCoverImage = 'https://via.placeholder.com/150';

const UserBooks = ({ booksData }) => {
    const [userId, setUserId] = useState(null);
    const [penalites, setPenalites] = useState([]); // Store penalites
    const [emprunts, setEmprunts] = useState([]); // Store emprunts
    const [canReserve, setCanReserve] = useState(true); // Track if the user can reserve

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const email = getEmailFromToken();
                console.log('Email extrait du token:', email);
    
                if (!email) {
                    console.error("Aucun email trouvé dans le token.");
                    return;
                }
    
                const user = await getUserByEmail(email);
                console.log('Utilisateur récupéré:', user);
    
                if (user) {
                    setUserId(user.id);
    
                    // Fetch emprunts for the user
                    const empruntsData = await getEmpruntsByUtilisateur(user.id);
                    console.log('Emprunts récupérés pour l\'utilisateur:', empruntsData); // Log emprunts data
                    
                    // Check if any emprunt is "RETARD"
                    const empruntsRetard = empruntsData.filter(emprunt => emprunt.statut === 'RETARD');
                    console.log('Emprunts en retard:', empruntsRetard); // Log emprunts with status RETARD
    
                    setEmprunts(empruntsRetard); // Store emprunts with status RETARD

                    // Fetch penalites for the user
                    const penalitesData = await fetchPenalitesByUtilisateur(user.id);
                    console.log('Pénalités récupérées:', penalitesData);
                    setPenalites(penalitesData); // Store penalites
                    
                    // If user has any emprunt in RETARD or an active penalite, prevent reservations
                    const hasRetard = empruntsRetard.length > 0;
                    const hasActivePenalite = penalitesData.some(penalite => {
                        const now = new Date();
                        const dateFin = new Date(penalite.dateFin);
                        return now < dateFin;
                    });
                    
                    if (hasRetard) {
                        console.log('L\'utilisateur a un emprunt en retard.');
                    }
                    if (hasActivePenalite) {
                        console.log('L\'utilisateur a une pénalité active.');
                    }
                        // Check if user has two emprunts with statut = "ATTENTE"
                        const empruntsAttente = empruntsData.filter(emprunt => emprunt.statut === 'ATTENTE');
                        console.log('Emprunts en attente:', empruntsAttente); // Log emprunts with status ATTENTE

                        const hasTwoAttente = empruntsAttente.length >= 2;
                        if (hasTwoAttente) {
                            console.log('L\'utilisateur a deux emprunts en attente.');
                        }

                        setCanReserve(!hasRetard && !hasActivePenalite && !hasTwoAttente); // Update the condition
           } else {
                    console.error("Utilisateur non trouvé.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur connecté:", error);
            }
        };
    
        fetchUser();
    }, [booksData]);

    return (
        <div className="books-section">
            <div className="row">
                {booksData.length > 0 ? (
                    booksData.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            userId={userId}
                            penalites={penalites}
                            emprunts={emprunts} // Pass emprunts to BookCard
                            canReserve={canReserve} // Pass canReserve state to BookCard
                        />
                    ))
                ) : (
                    <p className="text-center">Aucun livre trouvé pour cette catégorie.</p>
                )}
            </div>
        </div>
    );
};

const BookCard = ({ book, userId, penalites, emprunts, canReserve }) => {
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [borrowDate, setBorrowDate] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleBorrowClick = () => {
        console.log('Réservation demandée pour le livre:', book);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        console.log('Fermeture de la modal de réservation.');
        setShowModal(false);
        setBorrowDate('');
        setShowSuccess(false);
    };

    const handleDateChange = (e) => {
        console.log('Date d\'emprunt sélectionnée:', e.target.value);
        setBorrowDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Formulaire de réservation soumis.');

        const reservation = {
            utilisateurId: userId,
            documentId: book.id,
            dateReservation: borrowDate,
            reservationStatus: "ENCOURS",
        };

        console.log('Données de la réservation:', reservation);

        try {
            await createReservation(reservation);
            console.log('Réservation effectuée avec succès.');
            setShowSuccess(true);
            setBorrowDate('');
            setTimeout(() => {
                setShowSuccess(false);
                setShowModal(false);
            }, 3000);
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const getCoverImage = (imageBase64) => {
        if (imageBase64) {
            if (imageBase64.startsWith('data:image')) {
                return imageBase64;
            } else {
                return `data:image/jpeg;base64,${imageBase64}`;
            }
        }
        return defaultCoverImage;
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100">
                <img 
                    src={getCoverImage(book.img)} 
                    className="card-img-top" 
                    alt={book.titre} 
                />
                <div className="card-body">
                    <h5 className="card-title">{book.titre}</h5>
                    <p className="card-text">
                        <strong>Auteur(s):</strong> {Array.isArray(book.auteurs) ? book.auteurs.join(', ') : book.auteurs}
                    </p>
                   
                    {showMore && (
                        <>
                            <p className="card-text"><strong>Sous-titres:</strong> {book.sousTitre}</p>
                            <p className="card-text"><strong>Édition:</strong> {book.edition}</p>
                        </>
                    )}
                    <div className="button-container mt-2">
                        <button
                            className="btn btn-see"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? 'Voir moins' : 'Voir plus'}
                        </button>
                        {book.statut === 'EXIST' && canReserve && (
                        <button
                            className="btn btn-success"
                            onClick={handleBorrowClick}
                            disabled={!canReserve} // Disable if canReserve is false
                        >
                            Réserver
                        </button>
                    )}

                        
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Réserver un livre</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {showSuccess ? (
                                <Alert variant="success" className="text-center">
                                    <i className="bi bi-check-circle-fill"></i> Veuillez passer à la bibliothèque pour emprunter le livre avant 24 heures après la date de réservation.
                                </Alert>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="borrowDate">
                                        <Form.Label>Date d'emprunt</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={borrowDate}
                                            onChange={handleDateChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-2">
                                        Réserver
                                    </Button>
                                </Form>
                            )}
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
};


export default UserBooks;
