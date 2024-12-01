import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Historique.css';

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

    useEffect(() => {
        const fetchData = async () => {
            const data = [
                { id: 1, type: 'Réservation', cne: '123456', nomPrenom: 'John Doe', titreLivre: 'Le Grand Livre', dateAction: '2024-11-15', statut: 'Confirmé' },
                { id: 2, type: 'Retour', cne: '234567', nomPrenom: 'Jane Smith', titreLivre: 'Les Mystères de l\'univers', dateAction: '2024-11-10', statut: 'Terminé' },
                { id: 3, type: 'Réservation', cne: '345678', nomPrenom: 'Marc Dupont', titreLivre: 'Le Voyage Extraordinaire', dateAction: '2024-11-05', statut: 'Refusé' },
                { id: 4, type: 'Réservation', cne: '456789', nomPrenom: 'Alice Martin', titreLivre: 'Les Contes Perdus', dateAction: '2024-11-01', statut: 'Confirmé' },
                { id: 5, type: 'Retour', cne: '567890', nomPrenom: 'Bob Brown', titreLivre: 'Histoire et Mythes', dateAction: '2024-10-28', statut: 'Terminé' },
            ];
            setHistoriqueData(data);
            setFilteredData(data);
        };
        fetchData();
    }, []);

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

    return (
        <div className="container mt-4">
            {/* Filtres */}
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
                                <th>CNE</th>
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td className={getTypeClass(item.type)}>{item.type}</td>
                                    <td>{item.cne}</td>
                                    <td>{item.nomPrenom}</td>
                                    <td>{item.titreLivre}</td>
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

            {/* Pagination */}
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

            {/* Modal */}
            {selectedItem && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                            <div className="modal-header" style={{ backgroundColor: '#004079', color: 'white' }}>
                                <h5 className="modal-title">Détails de l'élément</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label text-dark">Type :</label>
                                    <input type="text" id="type" className="form-control" value={selectedItem.type} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cne" className="form-label text-dark">CNE :</label>
                                    <input type="text" id="cne" className="form-control" value={selectedItem.cne} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nomPrenom" className="form-label text-dark">Nom et Prénom :</label>
                                    <input type="text" id="nomPrenom" className="form-control" value={selectedItem.nomPrenom} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="titreLivre" className="form-label text-dark">Titre du Livre :</label>
                                    <input type="text" id="titreLivre" className="form-control" value={selectedItem.titreLivre} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dateAction" className="form-label text-dark">Date d'Action :</label>
                                    <input type="text" id="dateAction" className="form-control" value={selectedItem.dateAction} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="statut" className="form-label text-dark">Statut :</label>
                                    <input type="text" id="statut" className="form-control" value={selectedItem.statut} readOnly />
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
