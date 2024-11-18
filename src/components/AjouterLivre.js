import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import documentService from '../services/documentService.js';
import '../styles/AjouterLivre.css';

const AjouterLivre = () => {
    const [livre, setLivre] = useState({
        titre: '',
        auteur: '',
        soustitre: '',
        edition: '',
        cote1: '',
        cote2: '',
        descripteurs: '',
        statut: 'EXIST',  // Default statut value as expected by the backend
        img: '',          // Default empty img value
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLivre({ ...livre, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the data to be sent in the request
        const livreAvecDescripteurs = {
            titre: livre.titre,
            auteurs: livre.auteur.split(',').map(a => a.trim()).filter(Boolean),  // Convert auteur to array for auteurs
            sousTitre: livre.soustitre,  // Rename soustitre to sousTitre
            edition: livre.edition,
            cote1: livre.cote1,
            cote2: livre.cote2,
            descripteurs: livre.descripteurs.split(',').map(d => d.trim()).filter(Boolean),
            statut: livre.statut,
            img: livre.img,
        };
    
        // Log the data being sent to ensure it's correctly formatted
        console.log("Data being sent to backend:", livreAvecDescripteurs);
    
        try {
            // Send the formatted data to the backend
            await documentService.saveDocument(livreAvecDescripteurs);
            navigate('/gestion-livre');
        } catch (error) {
            console.error("Error adding the book:", error);
        }
    };

    const handleCancel = () => {
        navigate('/gestion-livre');
    };

    return (
        <div className="ajouter-livre-container">
            <h2>Ajouter un Livre</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titre:</label>
                    <input type="text" name="titre" value={livre.titre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Auteur (séparés par des virgules si plusieurs):</label>
                    <input type="text" name="auteur" value={livre.auteur} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Sous-titre:</label>
                    <input type="text" name="soustitre" value={livre.soustitre} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Édition:</label>
                    <input type="text" name="edition" value={livre.edition} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Cote 1:</label>
                    <input type="text" name="cote1" value={livre.cote1} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Cote 2:</label>
                    <input type="text" name="cote2" value={livre.cote2} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Descripteurs (séparés par des virgules):</label>
                    <input type="text" name="descripteurs" value={livre.descripteurs} onChange={handleChange} />
                </div>
                <div className="button-container">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Annuler</button>
                    <button type="submit" className="btn btn-success">Ajouter</button>
                </div>
            </form>
        </div>
    );
};

export default AjouterLivre;
