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
        nbrExemplaire: '',
        statut: 'EXIST',  // Default statut value as expected by the backend
        img: '',        // Default empty img value
    });

    const [erreur, setErreur] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLivre({ ...livre, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                let imgBase64 = reader.result;
    
                // Supprimer la partie 'data:image/jpeg;base64,' si elle existe
                imgBase64 = imgBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
                // Mettre à jour l'état avec l'image nettoyée
                setLivre({ ...livre, img: imgBase64 });
                console.log("Image Base64 nettoyée:", imgBase64);  // Log base64 data sans la partie 'data:image/...' 
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (livre.nbrExemplaire <= 0) {
            setErreur('Le nombre d’exemplaires doit être un nombre positif supérieur à zéro.');
            return;
        }

        console.log("Image Base64 avant envoi:", livre.img);
//if (!livre.img) {
   // setErreur("Veuillez ajouter une image.");
    //return;
//}


        // Mise à jour des erreurs
        
        // Prepare the data to be sent in the request
        const livreAvecDescripteurs = {
            titre: livre.titre,
            auteurs: livre.auteur.split(',').map(a => a.trim()).filter(Boolean),  // Convert auteur to array for auteurs
            sousTitre: livre.soustitre,  
            edition: livre.edition,
            cote1: livre.cote1,
            cote2: livre.cote2,
            descripteurs: livre.descripteurs.split(',').map(d => d.trim()).filter(Boolean),
            nbrExemplaire: livre.nbrExemplaire,
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
            {erreur && <p className="alert">{erreur}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titre:</label>
                    <input type="text" name="titre" value={livre.titre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Auteur :</label>
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
                    <label>Descripteurs :</label>
                    <input type="text" name="descripteurs" value={livre.descripteurs} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Nombre d'exemplaires :</label>
                    <input type="number" name="nbrExemplaire" value={livre.nbrExemplaire} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Image:</label>
                    <input type="file" name="img" onChange={handleImageChange} />
                </div>
                <div className="button-container">
                    <button type="submit" className="btn btn-success"
                        style={{
                            backgroundColor: '#004079ff',  
                            color: 'white',              
                            border: 'none',             
                            padding: '10px 20px',        
                            borderRadius: '10px',        
                            fontSize: '16px',            
                        }}>Ajouter</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} style={{
                        backgroundColor: '#f44336',  
                        color: 'white',              
                        border: 'none',             
                        padding: '10px 20px',        
                        borderRadius: '10px',
                        fontSize: '16px',   
                    }}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default AjouterLivre;
