import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserBooks.css';
import { getEmailFromToken} from '../services/authService';
import { getUserByEmail } from '../services/userService';
import { createReservation } from '../services/reservationService';

const defaultCoverImage = 'https://via.placeholder.com/150';

const UserBooks = ({ booksData }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const email = getEmailFromToken();
                if (!email) {
                    console.error("Aucun email trouvé dans le token.");
                    return;
                }

                const user = await getUserByEmail(email);
                if (user) {
                    setUserId(user.id);
                    
                } else {
                    console.error("Utilisateur non trouvé.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur connecté :", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="books-section">
            <div className="row">
                {booksData.length > 0 ? (
                    booksData.map((book) => (
                        <BookCard key={book.id} book={book} userId={userId} />
                    ))
                ) : (
                    <p className="text-center">Aucun livre trouvé pour cette catégorie.</p>
                )}
            </div>
        </div>
    );
};

const BookCard = ({ book, userId }) => {
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [borrowDate, setBorrowDate] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleBorrowClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setBorrowDate('');
        setShowSuccess(false);
    };

    const handleDateChange = (e) => {
        setBorrowDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Créez une réservation en liant l'utilisateur et le livre
        const reservation = {
            utilisateurId: userId, // ID de l'utilisateur connecté
            documentId: book.id, // ID du livre
            dateReservation: borrowDate,
            reservationStatus: "ENCOURS" // Date choisie
        };
    
        try {
            // Utiliser le service pour envoyer la demande de réservation
            await createReservation(reservation);
    
            // Afficher le message de succès après la réussite
            setShowSuccess(true);
    
            // Réinitialise le champ de date après la soumission
            setBorrowDate('');
    
            // Cache le message de succès et ferme la modale après 3 secondes
            setTimeout(() => {
                setShowSuccess(false);
                setShowModal(false);
            }, 3000);
        } catch (error) {
            console.error('Erreur lors de la réservation :', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    };
    

    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100">
                <img src={book.coverImage || defaultCoverImage} className="card-img-top" alt={book.titre} />
                <div className="card-body">
                    <h5 className="card-title">{book.titre}</h5>
                    <p className="card-text"><strong>Auteur(s) :</strong> {Array.isArray(book.auteurs) ? book.auteurs.join(', ') : book.auteurs}</p>

                    <p className={`card-text ${book.statut ? 'text-success' : 'text-danger'}`}>
                        <strong>Disponibilité :</strong> {book.statut ? 'Disponible' : 'Indisponible'}
                    </p>

                    {showMore && (
                        <>
                            <p className="card-text"><strong>Sous-titres :</strong> {book.sousTitre}</p>
                            <p className="card-text"><strong>Édition :</strong> {book.edition}</p>
                        </>
                    )}

                    <div className="button-container mt-2">
                        <button
                            className="btn btn-see"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? 'Voir moins' : 'Voir plus'}
                        </button>

                        {book.statut && (
                            <button
                                className="btn btn-success"
                                onClick={handleBorrowClick}
                            >
                                Reserver
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
