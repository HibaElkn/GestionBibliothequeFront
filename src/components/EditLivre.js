import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentService from '../services/documentService'; // Assuming you've imported the service
import '../styles/EditLivre.css';

const EditLivre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livre, setLivre] = useState({
    auteur: '',
    titre: '',
    soustitre: '',
    edition: '',
    cote1: '',
    cote2: '',
    descripteurs: '',
  });
  const [erreur, setErreur] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false); // État pour gérer la boîte de confirmation

  useEffect(() => {
    const fetchLivre = async () => {
      try {
        const response = await documentService.getDocumentById(id);
        setLivre(response);
      } catch (error) {
        setErreur('Livre non trouvé');
      }
    };
    fetchLivre();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLivre({ ...livre, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate that fields are not empty
      if (!livre.auteur || !livre.titre) {
        setErreur("L'auteur et le titre sont obligatoires.");
        return;
      }
      
      // Log for debugging
      console.log('Auteur:', livre.auteur);
      console.log('Titre:', livre.titre);
      
      const documentData = {
        auteurs: [livre.auteur],  // Ensure it is an array
        titre: livre.titre,
        sousTitre: livre.soustitre,
        edition: livre.edition,
        cote1: livre.cote1,
        cote2: livre.cote2,
        descripteurs: livre.descripteurs.split(',').map(d => d.trim()), // Assuming descripteurs is a comma-separated string
        statut: "EXIST", 
        img: "base64EncodedImageHere" // Dynamic image if needed
      };
      
      console.log('Document Data:', documentData);  // Log the document data again for confirmation
      
      await documentService.updateDocument(id, documentData);
      setConfirmationVisible(true);
    } catch (error) {
      setErreur('Une erreur est survenue lors de la mise à jour');
      console.error('Error updating document:', error);
    }
  };
  

  const handleCancel = () => {
    navigate('/livres'); // Rediriger vers la page des livres
  };

  const handleConfirmationClose = () => {
    setConfirmationVisible(false);
    navigate('/gestion-livre'); // Redirect to the desired route after confirmation
};

  return (
    <div className="modifier-livre-container">
      <h2>Modifier le Livre</h2>
      {erreur && <p className="alert">{erreur}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Auteur:</label>
          <input
            type="text"
            name="auteur"
            value={livre.auteur}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Titre:</label>
          <input
            type="text"
            name="titre"
            value={livre.titre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sous-titre:</label>
          <input
            type="text"
            name="soustitre"
            value={livre.soustitre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Édition:</label>
          <input
            type="text"
            name="edition"
            value={livre.edition}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Cote 1:</label>
          <input
            type="text"
            name="cote1"
            value={livre.cote1}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Cote 2:</label>
          <input
            type="text"
            name="cote2"
            value={livre.cote2}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Descripteurs:</label>
          <input
            type="text"
            name="descripteurs"
            value={livre.descripteurs}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="btn-success">Mettre à jour</button>
          <button type="button" onClick={handleCancel} className="btn-cancel">Annuler</button>
        </div>
      </form>

      {confirmationVisible && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <p>Le livre a été mis à jour avec succès !</p>
            <button onClick={handleConfirmationClose} className="btn-confirm">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLivre;
