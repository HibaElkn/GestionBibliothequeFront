// components/Emprunts.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Emprunts.css';

const Emprunts = ({ empruntsData = [], onDeleteEmprunt, onAddEmprunt }) => { 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [showAddEmpruntPopup, setShowAddEmpruntPopup] = useState(false);
    const [newEmprunt, setNewEmprunt] = useState({
        cne: '',
        numSom: '',
        nomPrenom: '',
        titreLivre: '',
        dateEmprunt: '',
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(empruntsData) ? empruntsData.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(empruntsData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteEmprunt = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet emprunt ?")) {
            onDeleteEmprunt(id);
        }
    };

    const handleAddEmpruntChange = (e) => {
        setNewEmprunt({ ...newEmprunt, [e.target.name]: e.target.value });
    };

    const handleAddEmpruntSubmit = () => {
        onAddEmprunt(newEmprunt); // Appel à la fonction d'ajout
        setShowAddEmpruntPopup(false); // Ferme la popup
        setNewEmprunt({
            cne: '',
            numSom: '',
            nomPrenom: '',
            titreLivre: '',
            dateEmprunt: '',
        }); // Réinitialise le formulaire
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-end mb-3"> 
            <button 
    onClick={() => setShowAddEmpruntPopup(true)} 
    className="btn ml-auto" 
    style={{
        backgroundColor: '#D99A22', 
        color: '/#004079ff',           
        border: '1px solid #D99A22', 
        padding: '10px 20px',       
        borderRadius: '5px',        
    }}>
    <i className="fas fa-plus"></i> Ajouter un emprunt
</button>

</div>

            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>CNE / Num de Som</th>
                            <th>Nom et Prénom</th>
                            <th>Titre du Livre</th>
                            <th>Date d'Emprunt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(emprunt => (
                            <tr key={emprunt.id}>
                                <td>{emprunt.cne} / {emprunt.numSom}</td>
                                <td>{emprunt.nomPrenom}</td>
                                <td>{emprunt.titreLivre}</td>
                                <td>{emprunt.dateEmprunt}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteEmprunt(emprunt.id)} 
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

            {showAddEmpruntPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h5>Ajouter un emprunt</h5>
                        <input type="text" name="cne" placeholder="CNE" onChange={handleAddEmpruntChange} value={newEmprunt.cne} />
                        <input type="text" name="numSom" placeholder="Num de Som" onChange={handleAddEmpruntChange} value={newEmprunt.numSom} />
                        <input type="text" name="nomPrenom" placeholder="Nom et Prénom" onChange={handleAddEmpruntChange} value={newEmprunt.nomPrenom} />
                        <input type="text" name="titreLivre" placeholder="Titre du Livre" onChange={handleAddEmpruntChange} value={newEmprunt.titreLivre} />
                        <input type="date" name="dateEmprunt" placeholder="Date d'Emprunt" onChange={handleAddEmpruntChange} value={newEmprunt.dateEmprunt} />
                        <button onClick={handleAddEmpruntSubmit} className="btn btn-primary custom-btn mt-2">Ajouter l'emprunt</button>
                        <button onClick={() => setShowAddEmpruntPopup(false)} className="btn btn-secondary mt-2">Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Emprunts;
