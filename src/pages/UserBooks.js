import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserBooks.css';
import { getEmailFromToken } from '../services/authService';
import { getUserByEmail } from '../services/userService';
import { createReservation } from '../services/reservationService';
import { isEmpruntCountValid } from '../services/empruntService';

const defaultCoverImage = 'https://via.placeholder.com/150';

const UserBooks = ({ booksData }) => {
    const [userId, setUserId] = useState(null);
    const [isEligible, setIsEligible] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const email = getEmailFromToken();
                console.log('Email extrait du token:', email);

                if (!email) {
                    console.error("Aucun email trouvé dans le token.");
                    return;
                }
                console.log('Données des livres:', booksData);

                const user = await getUserByEmail(email);
                console.log('Utilisateur récupéré:', user);

                if (user) {
                    setUserId(user.id);

                    // Vérifier l'éligibilité
                    const eligible = await isEmpruntCountValid(user.id);
                    console.log('Éligibilité pour emprunt (avant mise à jour):', eligible);
                    setIsEligible(eligible);
                    console.log('Éligibilité mise à jour dans le state:', eligible);
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
                            isEligible={isEligible}
                        />
                    ))
                ) : (
                    <p className="text-center">Aucun livre trouvé pour cette catégorie.</p>
                )}
            </div>
        </div>
    );
};

const BookCard = ({ book, userId, isEligible }) => {
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
        console.log('Image base64 reçue:', imageBase64);
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
                    <p className={`card-text ${book.statut === 'EXIST' ? 'text-success' : 'text-danger'}`}>
                        <strong></strong> {book.statut === 'EXIST' ? 'Disponible' : 'Indisponible'}
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
                            onClick={() => {
                                console.log('Voir plus / Voir moins cliqué.');
                                setShowMore(!showMore);
                            }}
                        >
                            {showMore ? 'Voir moins' : 'Voir plus'}
                        </button>
                        {book.statut === 'EXIST' && isEligible && (
                            <button
                                className="btn btn-success"
                                onClick={handleBorrowClick}
                            >
                                Réserver
                            </button>
                        )}
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Demande d'emprunt</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {showSuccess ? (
                                <Alert variant="success" className="text-center">
                                    <i className="bi bi-check-circle-fill"></i> Demande d'emprunt envoyée avec succès !
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
                                    <Button variant="primary" type="submit" className="mt-3">
                                        Envoyer la demande
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
