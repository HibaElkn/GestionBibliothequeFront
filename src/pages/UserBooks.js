// components/UserBooks.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserBooks.css';

const defaultCoverImage = 'https://via.placeholder.com/150';

const UserBooks = ({ booksData }) => {
    return (
        <div className="books-section">
            <div className="row">
                {booksData.length > 0 ? (
                    booksData.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))
                ) : (
                    <p className="text-center">Aucun livre trouvé pour cette catégorie.</p>
                )}
            </div>
        </div>
    );
};

const BookCard = ({ book }) => {
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [reserveDate, setReserveDate] = useState(''); // Remplacer 'borrowDate' par 'reserveDate'
    const [showSuccess, setShowSuccess] = useState(false);

    const handleReserveClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setReserveDate('');
        setShowSuccess(false);
    };

    const handleDateChange = (e) => {
        setReserveDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log(`Demande de réservation pour le livre "${book.title}" le ${reserveDate}`);
        
        // Affiche le message de succès dans la modale
        setShowSuccess(true);
        
        // Réinitialise le champ de date après la soumission
        setReserveDate('');
        
        // Cache le message de succès et ferme la modale après 3 secondes
        setTimeout(() => {
            setShowSuccess(false);
            setShowModal(false);
        }, 3000);
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100">
                <img src={book.coverImage || defaultCoverImage} className="card-img-top" alt={book.title} />
                <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text"><strong>Auteur(s) :</strong> {Array.isArray(book.author) ? book.author.join(', ') : book.author}</p>

                    <p className={`card-text ${book.available ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.8rem' }}>
                        <strong>Disponibilité :</strong> {book.available ? 'Disponible' : 'Indisponible'}
                    </p>



                    {showMore && (
                        <>
                            <p className="card-text"><strong>Catégorie :</strong> {book.category}</p>
                            <p className="card-text"><strong>Langue :</strong> {book.language}</p>
                        </>
                    )}

                    {/* Conteneur pour les boutons avec flexbox */}
                    <div className="button-container mt-2">
                        <button
                            className="btn btn-see"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? 'Voir moins' : 'Voir plus'}
                        </button>

                        {book.available && (
                            <button
                                className="btn btn-success"
                                onClick={handleReserveClick}
                            >
                                Réserver {/* Texte mis à jour */}
                            </button>
                        )}
                    </div>

                    {/* Modal pour la demande de réservation */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Demande de réservation</Modal.Title> {/* Titre mis à jour */}
                        </Modal.Header>
                        <Modal.Body>
                            {showSuccess ? (
                                // Message de succès après l'envoi de la demande
                                <Alert variant="success" className="text-center">
                                    <i className="bi bi-check-circle-fill"></i> Demande de réservation envoyée avec succès ! {/* Message mis à jour */}
                                </Alert>
                            ) : (
                                // Formulaire de demande de réservation
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="reserveDate">
                                        <Form.Label>Date de réservation</Form.Label> {/* Label mis à jour */}
                                        <Form.Control
                                            type="date"
                                            value={reserveDate}
                                            onChange={handleDateChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">
                                        Envoyer la demande {/* Bouton mis à jour */}
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
