import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Historique.css';
import { getAllEmprunts } from '../services/empruntService';
import { getAllReservations } from '../services/reservationService';
import authService from '../services/authService';
import userService from '../services/userService';
import documentService from '../services/documentService';

const StatusBadge = ({ statut }) => {
    const getStatutClass = (statut) => {
        switch (statut) {
            case 'Confirmé':
                return 'badge bg-success';
            case 'Terminé':
                return 'badge bg-primary';
            case 'Refusé':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };
    return <span className={getStatutClass(statut)}>{statut}</span>;
};

const Historique = () => {
    const [historiqueData, setHistoriqueData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterType, setFilterType] = useState('Tous');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const emailFromToken = authService.getEmailFromToken();
                const user = await userService.getUserByEmail(emailFromToken);
                setUserId(user.id);
            } catch (err) {
                setError("Impossible de récupérer les informations utilisateur.");
                console.error(err);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        const fetchHistorique = async () => {
            if (!userId) return;
            setLoading(true);
            setError(null);
            try {
                const emprunts = await getAllEmprunts();
                const reservations = await getAllReservations();

                const empruntsAvecType = emprunts
                    .filter(emprunt => emprunt.statut === 'RETOURNER')
                    .map(emprunt => ({
                        ...emprunt,
                        type: 'Retour',
                        titre: emprunt.document?.titre || emprunt.titre,
                        code: emprunt.utilisateur?.code || 'Non disponible',
                        nomPrenom: `${emprunt.utilisateur?.nom || ''} ${emprunt.utilisateur?.prenom || ''}`.trim(),
                        dateAction: emprunt.dateRetour || emprunt.dateEmprunt,
                    }));

                    const reservationsAvecType = await Promise.all(
                        reservations
                        .filter(reservation => reservation.reservationStatus !== "ENCOURS")
                        .map(async (reservation) => {
                        try {
                            const document = await documentService.getDocumentById(reservation.documentId); // Récupère le document
                            const user = await userService.getUserById(reservation.utilisateurId); // Récupère l'utilisateur
                    
                            return {
                                ...reservation,
                                titre: document.titre || "Titre non disponible", // Ajoute le titre du document
                                code: user?.code || "code non disponible", // Ajoute le code de l'utilisateur
                                nomPrenom: user ? `${user.nom} ${user.prenom}` : "Nom non disponible", // Nom et prénom de l'utilisateur
                                dateAction: reservation.dateReservation , // Assurez-vous que cette date est correcte
                                statut: reservation.reservationStatus, // Statut de la réservation (ACCEPTED ou REJECTED)
                                type: 'Réservation',  // Marquer le type comme "Réservation"
                            };
                        } catch (err) {
                            console.error(`Erreur lors de la récupération des informations pour la réservation ID: ${reservation.id}`, err);
                            return null; // Retourne null si une erreur se produit
                        }
                    }));
                    

                const filteredReservations = reservationsAvecType.filter(reservation => reservation !== null);

                const historique = [...empruntsAvecType, ...filteredReservations];
                setHistoriqueData(historique);
                setFilteredData(historique);
            } catch (err) {
                setError("Erreur lors du chargement de l'historique. Veuillez réessayer.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorique();
    }, [userId]);

    useEffect(() => {
        const filtered = filterType === 'Tous'
            ? historiqueData
            : historiqueData.filter(item => item.type === filterType);
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [filterType, historiqueData]);

    const sortDataByDate = () => {
        const sorted = [...filteredData].sort((a, b) => {
            const dateA = new Date(a.dateAction);
            const dateB = new Date(b.dateAction);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setFilteredData(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const openModal = (item) => setSelectedItem(item);
    const closeModal = () => setSelectedItem(null);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getTypeClass = (type) => {
        return type === 'Réservation' ? 'text-primary' : 'text-warning';
    };

    if (loading) {
        return <div className="text-center">Chargement de l'historique...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="ms-auto">
                    <label htmlFor="filter" className="me-2" style={{ color: '#004079' }}>Filtrer par type :</label>
                    <select
                        id="filter"
                        className="form-select d-inline-block w-auto"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="Tous">Tous</option>
                        <option value="Réservation">Réservations</option>
                        <option value="Retour">Retours</option>
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                {filteredData.length === 0 ? (
                    <div className="alert alert-warning text-center">Aucune donnée disponible pour ce filtre.</div>
                ) : (
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Type</th>
                                <th>Code</th>
                                <th>Nom et Prénom</th>
                                <th>Titre du Livre</th>
                                <th>
                                    Date d'Action
                                    <button
                                        className="btn btn-sm btn-link ms-2 p-0 custom-btn"
                                        onClick={sortDataByDate}
                                    >
                                        {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                                    </button>
                                </th>
                                <th>Statut</th>
                                <th>Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td className={getTypeClass(item.type)}>{item.type}</td>
                                    <td>{item.code}</td>
                                    <td>{item.nomPrenom}</td>
                                    <td>{item.titre}</td>
                                    <td>{item.dateAction}</td>
                                    <td><StatusBadge statut={item.statut} /></td>
                                    <td>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => openModal(item)}
                                        >
                                            👁️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {filteredData.length > itemsPerPage && (
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
            )}

            {selectedItem && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedItem.titre}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Type :</label>
                                    <input type="text" className="form-control" id="type" value={selectedItem.type} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="code" className="form-label">Code :</label>
                                    <input type="text" className="form-control" id="code" value={selectedItem.code} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nomPrenom" className="form-label">Nom et Prénom :</label>
                                    <input type="text" className="form-control" id="nomPrenom" value={selectedItem.nomPrenom} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dateAction" className="form-label">Date d'Action :</label>
                                    <input type="text" className="form-control" id="dateAction" value={selectedItem.dateAction} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="statut" className="form-label">Statut :</label>
                                    <input type="text" className="form-control" id="statut" value={selectedItem.statut} readOnly />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historique;
