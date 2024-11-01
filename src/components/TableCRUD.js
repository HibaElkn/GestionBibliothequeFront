// File: C:\Users\hnebm\Desktop\gestion-bibliotheque-front\src\components\TableCRUD.js

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/UserManagement.css';

const TableCRUD = ({ data, firstColumnName, onEdit, onDelete, onDeleteSelected, onAdd }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showAddUserPopup, setShowAddUserPopup] = useState(false);
    const [showImportPopup, setShowImportPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [newUser, setNewUser] = useState({ massarOrSum: '', firstName: '', lastName: '', email: '' });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(currentItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems(selectedItems.includes(id)
            ? selectedItems.filter(itemId => itemId !== id)
            : [...selectedItems, id]
        );
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleDeleteConfirmation = (id) => {
        setIsBulkDelete(false);
        setItemToDelete(id);
        setShowDeletePopup(true);
    };

    const handleBulkDeleteConfirmation = () => {
        setIsBulkDelete(true);
        setShowDeletePopup(true);
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
            onDeleteSelected(selectedItems);
            setSelectedItems([]);
        } else if (itemToDelete !== null) {
            onDelete(itemToDelete);
        }
        setShowDeletePopup(false);
    };

    return (
        <div className="container">
            <div className="table-title">
                <button className="btn btn-success btn-sm me-2" onClick={() => setShowImportPopup(true)}>
                    <i className="fas fa-file-import"></i> Importer tous les utilisateurs
                </button>
                <button className="btn btn-success btn-sm me-2" onClick={() => setShowAddUserPopup(true)}>
                    <i className="fas fa-plus"></i> Ajouter un utilisateur
                </button>
            </div>

            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>
                                <span className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                                    />
                                    <label></label>
                                </span>
                            </th>
                            <th>{firstColumnName}</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <span className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                        />
                                        <label></label>
                                    </span>
                                </td>
                                <td>{item[firstColumnName.toLowerCase()]}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button className="edit btn btn-sm me-2" style={{ color: 'blue' }} onClick={() => onEdit(item)}>
                                        <i className="fas fa-pen"></i>
                                    </button>
                                    <button className="delete btn btn-sm" style={{ color: 'red' }} onClick={() => handleDeleteConfirmation(item.id)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedItems.length > 1 && (
                    <button className="btn btn-danger btn-sm mt-2" onClick={handleBulkDeleteConfirmation}>
                        <i className="fas fa-trash-alt"></i> Supprimer les utilisateurs sélectionnés
                    </button>
                )}

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

            {showAddUserPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Ajouter un utilisateur</h5>
                        <input type="text" name="massarOrSum" placeholder={firstColumnName} onChange={handleAddUserChange} />
                        <input type="text" name="firstName" placeholder="Prénom" onChange={handleAddUserChange} />
                        <input type="text" name="lastName" placeholder="Nom" onChange={handleAddUserChange} />
                        <input type="email" name="email" placeholder="Email" onChange={handleAddUserChange} />
                        <button className="btn btn-primary mt-2">Ajouter l'utilisateur</button>
                        <button className="btn btn-secondary mt-2" onClick={() => setShowAddUserPopup(false)}>Annuler</button>
                    </div>
                </div>
            )}

            {showImportPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Importer tous les utilisateurs</h5>
                        <input type="file" className="form-control" />
                        <button className="btn btn-primary mt-2">Importer</button>
                        <button className="btn btn-secondary mt-2" onClick={() => setShowImportPopup(false)}>Annuler</button>
                    </div>
                </div>
            )}

            {showDeletePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Confirmer la suppression</h5>
                        <p>Voulez-vous vraiment supprimer {isBulkDelete ? 'les utilisateurs sélectionnés ?' : 'cet utilisateur ?'}</p>
                        <button className="btn btn-primary2 mt-2" onClick={confirmDelete}>Confirmer</button>
                        <button className="btn btn-secondary mt-2" onClick={() => setShowDeletePopup(false)}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableCRUD;