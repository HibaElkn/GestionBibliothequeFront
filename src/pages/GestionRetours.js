import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const GestionRetours = ({ onDeleteRetour, onAddRetour }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [showAddRetourPopup, setShowAddRetourPopup] = useState(false);
    const [newRetour, setNewRetour] = useState({
        cne: '',
        titreLivre: '',
        dateRetour: '',
        statut: 'en attente', // Valeur par défaut
    });

    const [retoursData, setRetoursData] = useState([
        {
            id: 1,
            cne: '123456',
            titreLivre: 'Le Grand Livre',
            dateRetour: '2024-11-25',
            statut: 'retourné',
        },
        {
            id: 2,
            cne: '234567',
            titreLivre: 'Les Mystères de l\'univers',
            dateRetour: '2024-11-26',
            statut: 'en attente',
        },
        {
            id: 3,
            cne: '345678',
            titreLivre: 'Le Voyage Extraordinaire',
            dateRetour: '2024-11-27',
            statut: 'en retard',
        },
        {
            id: 4,
            cne: '456789',
            titreLivre: 'L\'Art de la Guerre',
            dateRetour: '2024-11-28',
            statut: 'en attente',
        },
        {
            id: 5,
            cne: '567890',
            titreLivre: 'Les Fleurs du Mal',
            dateRetour: '2024-11-29',
            statut: 'retourné',
        },
        {
            id: 6,
            cne: '678901',
            titreLivre: '1984',
            dateRetour: '2024-11-30',
            statut: 'en retard',
        },
        {
            id: 7,
            cne: '789012',
            titreLivre: 'Les Misérables',
            dateRetour: '2024-12-01',
            statut: 'retourné',
        },
        {
            id: 8,
            cne: '890123',
            titreLivre: 'La Peste',
            dateRetour: '2024-12-02',
            statut: 'en attente',
        },
        {
            id: 9,
            cne: '901234',
            titreLivre: 'Le Comte de Monte-Cristo',
            dateRetour: '2024-12-03',
            statut: 'en retard',
        },
        {
            id: 10,
            cne: '012345',
            titreLivre: 'Le Petit Prince',
            dateRetour: '2024-12-04',
            statut: 'retourné',
        }
    ]);

    const [filter, setFilter] = useState('tous'); // Ajout du filtre

    const filteredRetours = retoursData.filter((retour) => {
        if (filter === 'tous') return true;
        return retour.statut === filter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRetours.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRetours.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatutClass = (statut) => {
        switch (statut) {
            case 'retourné':
                return 'bg-success text-white';
            case 'en attente':
                return 'bg-warning text-white';
            case 'en retard':
                return 'bg-danger text-white';
            default:
                return '';
        }
    };

    const [editingStatut, setEditingStatut] = useState(null);
    const [alertMessage, setAlertMessage] = useState(''); 
    const handleStatutChange = (id, newStatut) => {
        const retourToUpdate = retoursData.find(retour => retour.id === id);
        const returnDate = new Date(retourToUpdate.dateRetour);
        const today = new Date();

        if (returnDate > today && newStatut === 'en retard') {
            setAlertMessage("Impossible de marquer ce retour comme en retard avant la date de retour !"); 
            setTimeout(() => setAlertMessage(''), 5000); 
            return;
        }

        const updatedRetours = retoursData.map(retour =>
            retour.id === id ? { ...retour, statut: newStatut } : retour
        );

        if (newStatut === 'retourné') {
            setRetoursData(updatedRetours.filter(retour => retour.id !== id));
        } else {
            setRetoursData(updatedRetours);
        }
    };

    const calculateRetardDuration = (dateRetour) => {
        const today = new Date();
        const returnDate = new Date(dateRetour);
        const timeDifference = today - returnDate;
        const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        return dayDifference > 0 ? dayDifference : 0;
    };

    return (
        <div className="container">
            {alertMessage && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 col-md-6 mx-auto" role="alert">
                    {alertMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                {/* Filtre des retours */}
                <div>
                    <select
                        className="form-select form-select-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="tous">Tous</option>
                        <option value="en retard">En retard</option>
                        <option value="en attente">En attente</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>CNE / Num de SOM</th>
                            <th>Titre du Livre</th>
                            <th>Date de Retour</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(retour => (
                            <tr key={retour.id}>
                                <td>{retour.cne}</td>
                                <td>{retour.titreLivre}</td>
                                <td>{retour.dateRetour}</td>
                                <td>
                                    <span className={`badge ${getStatutClass(retour.statut)} rounded-3 fs-10`}>
                                        {retour.statut}
                                    </span>
                                    
                                    {retour.statut === 'en retard' && (
                                        <span className="badge bg-danger ms-2">
                                            {calculateRetardDuration(retour.dateRetour)} jours de retard
                                        </span>
                                    )}

                                    <button
                                        className="btn btn-sm btn-info ms-2"
                                        onClick={() => setEditingStatut(retour.id)}
                                    >
                                        <i className="fa fa-pencil-alt"></i>
                                    </button>

                                    {editingStatut === retour.id && (
                                        <select
                                            value={retour.statut}
                                            onChange={(e) => {
                                                handleStatutChange(retour.id, e.target.value);
                                                setEditingStatut(null);
                                            }}
                                            className="form-select form-select-sm ms-2"
                                        >
                                            <option value="retourné">Retourné</option>
                                            <option value="en attente">En attente</option>
                                            <option value="en retard">En retard</option>
                                        </select>
                                    )}
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

export default GestionRetours;
