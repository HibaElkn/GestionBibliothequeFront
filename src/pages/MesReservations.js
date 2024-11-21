import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Assurez-vous d'importer FontAwesome
import '../styles/Emprunts.css';

const MesResrvations = ({ onDeleteReservation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    
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

    return (
        <div className="container">
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
        </div>
    );
};

export default MesResrvations;
