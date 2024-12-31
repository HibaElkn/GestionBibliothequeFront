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
    const [searchTerm, setSearchTerm] = useState(''); // For search functionality

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
                                const document = await documentService.getDocumentById(reservation.documentId);
                                const user = await userService.getUserById(reservation.utilisateurId);

                                return {
                                    ...reservation,
                                    titre: document.titre || "Titre non disponible",
                                    code: user?.code || "code non disponible",
                                    nomPrenom: user ? `${user.nom} ${user.prenom}` : "Nom non disponible",
                                    dateAction: reservation.dateReservation,
                                    statut: reservation.reservationStatus,
                                    type: 'Réservation',
                                };
                            } catch (err) {
                                console.error(`Erreur lors de la récupération des informations pour la réservation ID: ${reservation.id}`, err);
                                return null;
                            }
                        })
                );

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const filtered = historiqueData.filter(item =>
            item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    if (loading) {
        return <div className="text-center">Chargement de l'historique...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <form className="search-container" onSubmit={handleSearchSubmit}>
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="search-bar" 
                    value={searchTerm}
                    onChange={handleSearchChange} 
                />
                <i className="fas fa-search search-icon"></i>
            </form>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="ms-auto">
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
                <div className="modal-overlay">
                    <div className="modal">
                        <h5>Détails de {selectedItem.titre}</h5>
                        <div className="modal-body">
                            <p><strong>Nom:</strong> {selectedItem.nomPrenom}</p>
                            <p><strong>Code:</strong> {selectedItem.code}</p>
                            <p><strong>Statut:</strong> {selectedItem.statut}</p>
                            <p><strong>Date d'action:</strong> {selectedItem.dateAction}</p>
                            <p><strong>Description:</strong> {selectedItem.description || "Aucune description disponible"}</p>
                            <button className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historique;
