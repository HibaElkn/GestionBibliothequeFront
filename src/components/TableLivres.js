import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/BookManagement.css';
import documentService from '../services/documentService';

const TableLivres = ({ onEdit, onDelete, onDeleteSelected, onAddBooks }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState([]); // Store documents
    const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
    const [showImportPopup, setShowImportPopup] = useState(false); // State to toggle import popup
    const [showDeletePopup, setShowDeletePopup] = useState(false); // State to toggle delete popup
    const [selectedDeleteItems, setSelectedDeleteItems] = useState([]); // Track items to delete
    const [searchTerm, setSearchTerm] = useState(''); // For search functionality

    useEffect(() => {
        const getDocuments = async () => {
            try {
                setLoading(true);  
                const documents = await documentService.getAllDocuments();  
                setTableData(documents);  
                if (onAddBooks) {
                    onAddBooks(documents);
                }
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError("Failed to load documents.");
            } finally {
                setLoading(false);  
            }
        };
        getDocuments();  
    }, []);  
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle selecting/deselecting items
    const handleSelectAll = (e) => {
        setSelectedItems(e.target.checked ? currentItems.map(item => item.id) : []);
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(itemId => itemId !== id)
                : [...prevSelected, id]
        );
    };

    // Handle delete selected items
    const handleDeleteSelected = () => {
        setSelectedDeleteItems(selectedItems);
        setShowDeletePopup(true); // Show delete confirmation popup
    };

    const confirmDeleteSelected = async () => {
        try {
            await documentService.deleteDocuments(selectedDeleteItems);
            setTableData(prevData => prevData.filter(item => !selectedDeleteItems.includes(item.id)));
            setSelectedItems([]); // Clear selected items after deletion
            setShowDeletePopup(false); // Close the popup
        } catch (error) {
            console.error("Error deleting selected documents:", error);
            alert("Erreur lors de la suppression des livres sélectionnés.");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleDelete = async (id) => {
        setShowDeletePopup(true); 
        setSelectedDeleteItems([id]); // Set the item to be deleted
    };

    const confirmDelete = async () => {
        try {
            await documentService.deleteDocument(selectedDeleteItems[0]);
            setTableData(prevData => prevData.filter(item => item.id !== selectedDeleteItems[0]));
            setShowDeletePopup(false); // Close the popup
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Erreur lors de la suppression du document.");
        }
    };

    // Filter the data based on the search term
    const filteredData = tableData.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.titre.toLowerCase().includes(searchLower) ||
            item.auteurs.some(auteur => auteur.toLowerCase().includes(searchLower)) ||
            item.descripteurs.some(descriptor => descriptor.toLowerCase().includes(searchLower))
        );
    });
   
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log('Recherche pour:', searchTerm);
    };

    const handleImport = () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const cleanedData = jsonData.map(item => {
                    const trimmedItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            const trimmedKey = key.trim();
                            trimmedItem[trimmedKey] = item[key];
                        }
                    }

                    const sousTitre = trimmedItem['Sous titre'] || '';
                    return {
                        auteurs: trimmedItem['AUTEUR(S)'] ? trimmedItem['AUTEUR(S)'].split(',').map(author => author.trim()) : [],
                        titre: trimmedItem['TITRE(S)'] || '',
                        sousTitre: sousTitre,
                        edition: trimmedItem['Edition'] || '',
                        cote1: trimmedItem['Cote1'] || '',
                        cote2: trimmedItem['Cote2'] || '',
                        descripteurs: trimmedItem['Descripteurs'] ? trimmedItem['Descripteurs'].split('/').map(descriptor => descriptor.trim()) : [],
                        statut: 'EXIST',
                        img: 'base64EncodedImageHere',
                        nbrExemplaire: parseInt(trimmedItem['Nbr Ex']) || 1,
                    };
                });

                documentService.saveDocuments(cleanedData)
                    .then(response => {
                        setTableData(prevData => [...prevData, ...cleanedData]);
                        setShowImportPopup(false);
                    })
                    .catch(error => {
                        console.error('Error saving documents:', error);
                    });
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    // Show loading or error messages if necessary
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container">
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
            <div className="table-title">
                <button className="btn btn-success btn-sm me-2" onClick={() => setShowImportPopup(true)}>
                    <i className="fas fa-file-import"></i> Importer tous les livres
                </button>
                <Link to="/ajouter-livre" className="btn btn-success btn-sm me-2">
                    <i className="fas fa-plus"></i> Ajouter un livre
                </Link>
            </div>

            {/* Import popup */}
            {showImportPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Importer tous les livres</h5>
                        <input
                            type="file"
                            accept=".xls, .xlsx"
                            onChange={handleFileChange}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleImport}>
                            Importer
                        </button>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => setShowImportPopup(false)}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Delete confirmation popup */}
            {showDeletePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Êtes-vous sûr de vouloir supprimer ce(s) livre(s)?</h5>
                        <div class="btn-container">
                            <button className="btn btn-danger mt-2" onClick={selectedDeleteItems.length === 1 ? confirmDelete : confirmDeleteSelected}>
                                Confirmer
                            </button>
                            <button
                                className="btn btn-secondary mt-2"
                                onClick={() => setShowDeletePopup(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <th>Auteur(s)</th>
                            <th>Titre</th>
                            <th>Sous-titre</th>
                            <th>Édition</th>
                            <th>Cote1</th>
                            <th>Cote2</th>
                            <th>Descripteurs</th>
                            <th>Nbr Ex</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.slice(indexOfFirstItem, indexOfLastItem).map(item => (
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
                                <td>{item.auteurs.join(', ')}</td>
                                <td>{item.titre}</td>
                                <td>{item.sousTitre}</td>
                                <td>{item.edition}</td>
                                <td>{item.cote1}</td>
                                <td>{item.cote2}</td>
                                <td>{item.descripteurs.join(', ')}</td>
                                <td>{item.nbrExemplaire}</td>
                                <td className="actions">
                                <Link to={`/modifier-livre/${item.id}`} className="btn btn-sm me-2" style={{ backgroundColor: 'transparent', color: '#007bff' }}>
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button className="btn btn-sm" style={{ backgroundColor: 'transparent', color: '#dc3545' }} onClick={() => handleDelete(item.id)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Button to delete selected items */}
            {selectedItems.length > 0 && (
                            <div className="delete-button-container">
                                <button className="btn btn-danger btn-sm mt-2" onClick={handleDeleteSelected}>
                                    <i className="fas fa-trash-alt"></i> Supprimer les livres sélectionnés
                                </button>
                            </div>
                        )}
            {/* Pagination */}
            <nav>
                <ul className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default TableLivres;
