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

    useEffect(() => {
        const getDocuments = async () => {
            try {
                const documents = await documentService.getAllDocuments(); // Fetch documents from the service
                setTableData(documents);  // Update table data with fetched documents
                if (onAddBooks) {
                    onAddBooks(documents);  // Add books if the onAddBooks function is provided
                }
                setLoading(false);  // Turn off loading
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError("Failed to load documents.");
                setLoading(false);
            }
        };
        getDocuments();  // Call the fetch function
    }, [onAddBooks]);  // Dependency array ensures it runs on component mount

    // Pagination logic
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
        if (window.confirm("Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ?")) {
            // Send the delete request to the backend
            if (onDeleteSelected) {
                onDeleteSelected(selectedItems) // Call onDeleteSelected to delete the selected documents
                    .then(() => {
                        // Update the table state to remove deleted items
                        setTableData(prevData => prevData.filter(item => !selectedItems.includes(item.id)));
                        setSelectedItems([]); // Clear selected items after deletion
                    })
                    .catch(error => {
                        console.error("Error deleting selected documents:", error);
                        alert("Erreur lors de la suppression des livres sélectionnés.");
                    });
            } else {
                console.error('onDeleteSelected function is not defined');
            }
        }
    };

    // Handle file change for importing data
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Set the selected file when it changes
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
                console.log('Raw Imported JSON Data:', jsonData);  // Log raw data

                // Map the raw data to match the expected format
                const cleanedData = jsonData.map(item => {
                    // Trim the keys to ensure no leading/trailing spaces
                    const trimmedItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            const trimmedKey = key.trim();  // Trim spaces from the key
                            trimmedItem[trimmedKey] = item[key];  // Assign the value to the trimmed key
                        }
                    }

                    const sousTitre = trimmedItem['Sous titre'] || '';  // Ensure sousTitre is assigned as a string
                    console.log('Mapped sousTitre:', sousTitre);  // Log the value of sousTitre

                    return {
                        auteurs: trimmedItem['AUTEUR(S)'] ? trimmedItem['AUTEUR(S)'].split(',').map(author => author.trim()) : [],
                        titre: trimmedItem['TITRE(S)'] || '',
                        sousTitre: sousTitre,  // Directly store sousTitre as a normal field
                        edition: trimmedItem['Edition'] || '',
                        cote1: trimmedItem['Cote1'] || '',
                        cote2: trimmedItem['Cote2'] || '',
                        descripteurs: trimmedItem['Descripteurs'] ? trimmedItem['Descripteurs'].split('/').map(descriptor => descriptor.trim()) : [],
                        statut: 'EXIST',
                        img: 'base64EncodedImageHere'  // Replace with actual base64 image or logic to fetch image
                    };
                });

                console.log('Cleaned Data:', cleanedData);  // Log cleaned data

                // Send the data to the backend
                documentService.saveDocuments(cleanedData)
                    .then(response => {
                        console.log('Documents successfully saved:', response);
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
            <div className="table-title">
                {/* Button to show the import popup */}
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
                            onClick={() => setShowImportPopup(false)} // Close the popup
                        >
                            Annuler
                        </button>
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
                            <th>Cote 1</th>
                            <th>Cote 2</th>
                            <th>Descripteurs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
    {currentItems.map(item => {
        console.log("Soustitre:", item.soustitre);  // Vérifiez le contenu de soustitre ici

        return (
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
                <td>
                    {item.soustitre && item.soustitre.trim() !== "" 
                        ? item.soustitre.trim() 
                        : "Non précisé"}  {/* Affiche "Non précisé" si soustitre est vide */}
                </td>
                <td>{item.edition}</td>
                <td>{item.cote1}</td>
                <td>{item.cote2}</td>
                <td>{item.descripteurs.join(', ')}</td>
                <td>
                    <Link to={`/modifier-livre/${item.id}`} className="btn btn-sm me-2" style={{ backgroundColor: '#007bff' }}>
                        <i className="fas fa-edit"></i>
                    </Link>
                    <button
                        className="btn btn-sm me-2"
                        style={{ backgroundColor: '#dc3545' }}
                        onClick={() => onDelete(item.id)}  // onDelete is passed as a prop
                    >
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        );
    })}
</tbody>

                </table>
            </div>

            {/* Button to delete selected items */}
            {selectedItems.length > 0 && (
                <button className="btn btn-danger btn-sm mt-2" onClick={handleDeleteSelected}>
                    <i className="fas fa-trash-alt"></i> Supprimer les livres sélectionnés
                </button>
            )}

            {/* Pagination */}
            <nav>
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
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
