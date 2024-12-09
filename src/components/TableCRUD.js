// File: C:\Users\hnebm\Desktop\gestion-bibliotheque-front\src\components\TableCRUD.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/UserManagement.css';
import userService from '../services/userService';

    
const TableCRUD = ({ data, firstColumnName,firstColumnKey, onEdit, onDelete, onDeleteSelected, onAdd, onImport }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showAddUserPopup, setShowAddUserPopup] = useState(false);
    const [showEditUserPopup, setShowEditUserPopup] = useState(false);
    const [showImportPopup, setShowImportPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [errors, setErrors] = useState({});  // Assurez-vous que cette ligne est présente
    const [selectedFile, setSelectedFile] = useState(null);  // État pour le fichier sélectionné
    const [successMessage, setSuccessMessage] = useState('');


    const [newUser, setNewUser] = useState({ code: '', prenom: '', nom: '', email: '' });
    const [editUser, setEditUser] = useState({ id: null, code: '', prenom: '', nom: '', email: '' });

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    
    const handleImport = () => {
        if (selectedFile) {
            onImport(selectedFile); // Appelle la fonction onImport passée en prop
            setShowImportPopup(false);
            setSelectedFile(null);
        }
    };

    const validateEditForm = () => {
        let formErrors = {};
        if (!editUser.email) {
            formErrors.email = 'Ce champ est requis';
        } else if (!editUser.email.endsWith('@uhp.ac.ma')) {
            formErrors.email = "L'email doit se terminer par '@uhp.ac.ma'";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };
    

    
    const validateForm = () => {
        let formErrors = {};
        if (!newUser.code) formErrors.code = 'Ce champ est requis';
        if (!newUser.prenom) formErrors.prenom = 'Ce champ est requis';
        if (!newUser.nom) formErrors.nom = 'Ce champ est requis';
        if (!newUser.email) {
            formErrors.email = 'Ce champ est requis';
        } else if (!newUser.email.endsWith('@uhp.ac.ma')) {
            formErrors.email = "L'email doit se terminer par '@uhp.ac.ma'";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
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
    }

    const handleAddUser = () => {
        if (validateForm()) {
            onAdd(newUser);
            setShowAddUserPopup(false);
            setNewUser({ code: '', prenom: '', nom: '', email: '' });
            setErrors({});
        }
    };


    const handleEditUserChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
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
    const handleResetPassword = async () => {
        try {
            // Appeler le service pour changer le mot de passe
            await userService.changeUserPassword(editUser.id, '123456');
            
            // Afficher un message de succès
            setSuccessMessage('Mot de passe réinitialisé avec succès');
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error);
            setSuccessMessage('Échec de la réinitialisation du mot de passe');
        } finally {
            // Fermer la popup
            setShowEditUserPopup(false);
        }
    };
    
    const openEditPopup = (user) => {
        setEditUser(user);
        setShowEditUserPopup(true);
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
                                <td>{item[firstColumnKey]}</td>
                                <td>{item.prenom}</td>
                                <td>{item.nom}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button className="edit btn btn-sm me-2" style={{ color: 'blue' }} onClick={() => openEditPopup(item)}>
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
                        <input
                            type="text"
                            name="code"
                            placeholder={firstColumnName}
                            onChange={handleAddUserChange}
                            value={newUser.code}
                        />
                        {errors.code && <div className="error-message">{errors.code}</div>}

                        <input
                            type="text"
                            name="prenom"
                            placeholder="Prénom"
                            onChange={handleAddUserChange}
                            value={newUser.prenom}
                        />
                        {errors.prenom && <div className="error-message">{errors.prenom}</div>}

                        <input
                            type="text"
                            name="nom"
                            placeholder="Nom"
                            onChange={handleAddUserChange}
                            value={newUser.nom}
                        />
                        {errors.nom && <div className="error-message">{errors.nom}</div>}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleAddUserChange}
                            value={newUser.email}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}

                        <button className="btn btn-primary mt-2" onClick={handleAddUser}>Ajouter l'utilisateur</button>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => setShowAddUserPopup(false)}                           
                             style={{
                                backgroundColor: '#004079ff',  
                                color: 'white',              
                                border: 'none',              
                                padding: '10px 20px',        
                                borderRadius: '5px',        
                                fontSize: '16px',            
                            }}
                            >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
            {showEditUserPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Modifier l'utilisateur</h5>
                        <input type="text" name={firstColumnKey} value={editUser[firstColumnKey]} placeholder={firstColumnName} onChange={handleEditUserChange} />
                        <input type="text" name="prenom" value={editUser.prenom} placeholder="Prénom" onChange={handleEditUserChange} />
                        <input type="text" name="nom" value={editUser.nom} placeholder="Nom" onChange={handleEditUserChange} />
                        <input type="email" name="email" value={editUser.email} placeholder="Email" onChange={handleEditUserChange} />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                        <button className="btn btn-sm me-2" onClick={() => {
        if (validateEditForm()) {
            onEdit(editUser);
            setShowEditUserPopup(false);
            setErrors({});
        }
    }}
                         style={{
                                backgroundColor: '#004079ff',  
                                color: 'white',              
                                border: 'none',             
                                padding: '10px 20px',        
                                borderRadius: '5px',        
                                fontSize: '16px',            
                            }}>Enregistrer les modifications</button>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => setShowEditUserPopup(false)}
                            style={{
                                backgroundColor: '#004079ff',  
                                color: 'white',              
                                border: 'none',             
                                padding: '10px 20px',        
                                borderRadius: '5px',        
                                fontSize: '16px',            
                            }}
                            >
                            Annuler
                        </button>
                        <button
    className="btn btn-secondary mt-2"
    onClick={handleResetPassword}
    style={{
        backgroundColor: '#D99A22ff',  
        color: 'white',              
        border: 'none',             
        padding: '10px 20px',        
        borderRadius: '5px',        
        fontSize: '16px',            
    }}
>
    Réinitialiser le mot de passe
</button>

                    </div>
                </div>
            )}

{showImportPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Importer tous les utilisateurs</h5>
                        <input
                            type="file"
                            className="form-control"
                            accept=".xls, .xlsx"
                            onChange={handleFileChange}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleImport}>
                            Importer
                        </button>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => {
                                setShowImportPopup(false);
                                setSelectedFile(null);
                            }}
                            style={{
                                backgroundColor: '#004079ff',  
                                color: 'white',              
                                border: 'none',              
                                padding: '10px 20px',        
                                borderRadius: '5px',        
                                fontSize: '16px',            
                            }}
                        >
                            Annuler
                        </button>

                    </div>
                </div>
            )}

            {showDeletePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Confirmer la suppression</h5>
                        <p>Êtes-vous sûr de vouloir supprimer {isBulkDelete ? 'les utilisateurs sélectionnés' : 'cet utilisateur'} ?</p>
                        <button className="btn btn-primary2 mt-2" onClick={confirmDelete}>Confirmer</button>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => setShowDeletePopup(false)}
                            style={{
                                backgroundColor: '#004079ff',  
                                color: 'white',              
                                border: 'none',              
                                padding: '10px 20px',        
                                borderRadius: '5px',        
                                fontSize: '16px',            
                            }}
                            >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableCRUD;