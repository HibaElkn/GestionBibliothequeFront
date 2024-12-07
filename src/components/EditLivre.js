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
        const response = await documentService.getDocumentById(id); // Appel pour récupérer le livre
        console.log('Réponse complète:', response); // Afficher l'objet complet de la réponse dans la console pour débogage
  
        if (response) {
          // Vérifier si 'auteurs' existe et est un tableau, sinon le définir comme une chaîne vide
          const auteurs = response.auteurs && Array.isArray(response.auteurs) ? response.auteurs.join(', ') : '';
          
          // Vérifier si 'descripteurs' existe et est un tableau, sinon le définir comme une chaîne vide
          const descripteurs = response.descripteurs && Array.isArray(response.descripteurs) ? response.descripteurs.join(', ') : '';
  
          console.log('Auteurs:', auteurs); // Afficher les auteurs
          console.log('Descripteurs:', descripteurs); // Afficher les descripteurs
  
          setLivre({
            ...response,
            auteur: auteurs, // Affecter les auteurs sous forme de chaîne
            descripteurs: descripteurs, // Affecter les descripteurs sous forme de chaîne
          });
        } else {
          setErreur('Livre non trouvé');
        }
      } catch (error) {
        setErreur(`Une erreur est survenue lors de la récupération du livre: ${error.message}`);
        console.error('Erreur lors de la récupération du livre :', error); // Afficher l'erreur complète dans la console
      }
    };
  
    if (id) {
      fetchLivre(); // Appeler la fonction si l'ID est défini
    }
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLivre({ ...livre, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Vérifier que l'auteur et le titre ne sont pas vides
      if (!livre.auteur || !livre.titre) {
        setErreur("L'auteur et le titre sont obligatoires.");
        return;
      }

      // Convertir la chaîne d'auteurs en un tableau (séparé par des virgules)
      const auteursArray = livre.auteur.split(',').map(auteur => auteur.trim());

      const documentData = {
        auteurs: auteursArray,  // Assurez-vous d'envoyer un tableau d'auteurs
        titre: livre.titre,
        sousTitre: livre.soustitre,
        edition: livre.edition,
        cote1: livre.cote1,
        cote2: livre.cote2,
        descripteurs: livre.descripteurs.split(',').map(d => d.trim()), // Idem pour les descripteurs
        statut: "EXIST", 
        img: "base64EncodedImageHere" // Dynamique si nécessaire
      };

      console.log('Document Data:', documentData);  // Vérifier les données envoyées

      await documentService.updateDocument(id, documentData);
      setConfirmationVisible(true);  // Afficher la confirmation
    } catch (error) {
      setErreur('Une erreur est survenue lors de la mise à jour');
      console.error('Erreur lors de la mise à jour du document:', error);
    }
  };

  const handleCancel = () => {
    navigate('/gestion-livre'); // Rediriger vers la page des livres
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
