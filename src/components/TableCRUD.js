// File: C:\Users\hnebm\Desktop\gestion-bibliotheque-front\src\components\TableCRUD.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/UserManagement.css';
import userService from '../services/userService';
import authService from '../services/authService'; 


    
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
    const [searchTerm, setSearchTerm] = useState('');
  // Gestion de la recherche
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
};


const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Réinitialiser la page à 1 après une recherche
};

    const [newUser, setNewUser] = useState({ code: '', prenom: '', nom: '', email: '' });
    const [editUser, setEditUser] = useState({ id: null, code: '', prenom: '', nom: '', email: '', role: '' });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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
    const verifRole = async (user) => {
        try {
            const userData = await userService.getUserById(user.id);
            if (userData && userData.role) {
                console.log('Role:', userData.role);
                return userData.role;
            } else {
                console.error('Role non trouvé pour cet utilisateur');
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du rôle:', error);
            return null;
        }
    };
    

    const validateEditForm = () => {
        let formErrors = {};
        const emailRegex = /^[^\s@]+@uhp\.ac\.ma$/; // Valide uniquement les emails du domaine uph.ac.ma
    
        if (!editUser.email) {
            formErrors.email = 'Ce champ est requis';
        } else if (!emailRegex.test(editUser.email)) {
            formErrors.email = "L'email doit être au format 'xxx@uph.ac.ma'";
        }
        if (!editUser.role) {
            formErrors.role = 'Veuillez sélectionner un rôle';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };
    
    

    
    const validateForm = () => {
        let formErrors = {};
        const emailRegex = /^[^\s@]+@uhp\.ac\.ma$/; // Valide uniquement les emails du domaine uph.ac.ma
    
        if (!newUser.code) formErrors.code = 'Ce champ est requis';
        if (!newUser.prenom) formErrors.prenom = 'Ce champ est requis';
        if (!newUser.nom) formErrors.nom = 'Ce champ est requis';
        if (!newUser.email) {
            formErrors.email = 'Ce champ est requis';
        } else if (!emailRegex.test(newUser.email)) {
            formErrors.email = "L'email doit être au format 'xxx@uph.ac.ma'";
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
    const filteredData = data.filter(item => 
        item[firstColumnKey].toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
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
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
      setShowPopup(!showPopup);
    };

   const handleResetPassword = async () => {
        try {
         
            await userService.changeUserPassword(editUser.id, '123456');
            
            
            setSuccessMessage('Mot de passe réinitialisé avec succès');
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error);
            setSuccessMessage('Échec de la réinitialisation du mot de passe');
        } finally {
          
            setShowPopup(true);

            setTimeout(() => {
                setShowPopup(false);
                setShowEditUserPopup(false); 
            }, 3000); 
        }
    };
    
    const openEditPopup = async (user) => {
        const role = await verifRole(user);
        setEditUser({ ...user, role });
        setShowEditUserPopup(true);
    };

    return (
        <div className="container">
            <div className="table-title">
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
                        {editUser.role !== 'ETUDIANT'  && (
                        <select
                            name="role"
                            value={editUser.role}
                            onChange={handleEditUserChange}
                            className="form-select mt-2"
                        >
                            
                            <option value="ADMIN">Administrateur</option>
                            <option value="BIBLIOTHECAIRE">Bibliothécaire</option>
                            <option value="PERSONNEL">Personnel</option>
                            
                        </select>
                        )}

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
                    {showPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                    }}
                >
                    Mot de passe réinitialisé avec succès !
                </div>
            )}
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
