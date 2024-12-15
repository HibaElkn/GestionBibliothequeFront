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
    nbrExemplaire: '',
    img:'' // Géré comme une chaîne pour l'affichage
  });
  const [erreur, setErreur] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    const fetchLivre = async () => {
      try {
        const response = await documentService.getDocumentById(id);
        console.log('nommmmmmmmmmmbre22 : ', response.nbrExemplaire);

        if (response) {
          const auteurs = response.auteurs?.join(', ') || '';
          const descripteurs = response.descripteurs?.join(', ') || '';

          setLivre({
            auteur: auteurs,
            titre: response.titre || '',
            soustitre: response.sousTitre || '',
            edition: response.edition || '',
            cote1: response.cote1 || '',
            cote2: response.cote2 || '',
            descripteurs: descripteurs,
            nbrExemplaire: response.nbrExemplaire,
            img: response.img || null // Convertir en chaîne
          });
          
        } else {
          setErreur('Livre non trouvé');
        }
      } catch (error) {
        setErreur(`Une erreur est survenue lors de la récupération du livre: ${error.message}`);
      }
    };

    if (id) {
      fetchLivre();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLivre((prev) => ({
      ...prev,
      [name]: value, // Toujours stocker la valeur en tant que chaîne
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!livre.auteur || !livre.titre) {
        setErreur("L'auteur et le titre sont obligatoires.");
        return;
      }

      // Validation du nombre d'exemplaires
      const nbrExemplaire = parseInt(livre.nbrExemplaire, 10);
      if (isNaN(nbrExemplaire) || nbrExemplaire < 0) {
        setErreur('Le nombre d’exemplaires doit être un nombre positif.');
        return;
      }

      // Conversion des auteurs et descripteurs en tableau
      const auteursArray = livre.auteur.split(',').map((auteur) => auteur.trim());
      const descripteursArray = livre.descripteurs.split(',').map((d) => d.trim());

      // Préparation des données pour l'envoi
      const documentData = {
        auteurs: auteursArray,
        titre: livre.titre,
        sousTitre: livre.soustitre,
        edition: livre.edition,
        cote1: livre.cote1,
        cote2: livre.cote2,
        descripteurs: descripteursArray,
        statut: 'EXIST',
        img: livre.img, // Remplacez par une vraie image si nécessaire
        nbrExemplaire: parseInt(livre.nbrExemplaire), // Envoyé en tant qu'entier
      };
      console.log('docdataaaa', documentData);

      await documentService.updateDocument(id, documentData);
      setConfirmationVisible(true);
    } catch (error) {
      setErreur('Une erreur est survenue lors de la mise à jour');
      console.error('Erreur lors de la mise à jour du document:', error);
    }
  };

  const handleCancel = () => {
    navigate('/gestion-livre');
  };

  const handleConfirmationClose = () => {
    setConfirmationVisible(false);
    navigate('/gestion-livre');
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64String = reader.result;
        
        // Supprimer la partie 'data:image/jpeg;base64,' si elle existe
        base64String = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        
        setLivre({ ...livre, img: base64String });
        console.log("Image Base64 sans le préfixe :", base64String);  // Log base64 data sans préfixe
      };
      reader.readAsDataURL(file);
    }
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
        <div className="form-group">
          <label>Nombre d'exemplaires:</label>
          <input
            type="number"
            name="nbrExemplaire"
            value={livre.nbrExemplaire}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" name="img" onChange={handleImageChange} />
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
