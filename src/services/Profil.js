import React, { useState, useEffect } from 'react';
import '../styles/Profil.css';
import authService from '../services/authService';
import userService from '../services/userService';
import { Modal, Button } from 'react-bootstrap';

const Profil = () => {
  const [image, setImage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [code, setCode] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  // Charger les données utilisateur
  const loadUserData = async () => {
    const emailFromToken = authService.getEmailFromToken();
    setEmail(emailFromToken);
  
    try {
      const user = await userService.getUserByEmail(emailFromToken);
      setNom(user.nom);
      setPrenom(user.prenom);
      setCode(user.code);
      setUserId(user.id);
  
      // Charger l'image de profil depuis la base de données
      const userImage = await userService.getPhotoByUserId(user.id);
  
      if (userImage) {
        const blob = new Blob([userImage], { type: 'image/jpeg' }); // Définir le type MIME
        const imageUrl = URL.createObjectURL(blob); // Générer une URL temporaire
        setImage(imageUrl);
      } else {
        setImage('https://via.placeholder.com/150'); // Si pas d'image, afficher un placeholder
      }
    } catch (error) {
      setError("Impossible de récupérer les informations utilisateur.");
      console.error('Erreur de récupération des données utilisateur:', error);
    }
  };
  //Fonction pour supprimer l'image de profil
  const handleDeleteImage = async () => {
    try {
      // Appel à l'API pour supprimer l'image de profil
      await userService.deletePhotoByUserId(userId);
  
      // Réinitialiser l'image à un placeholder
      setImage('https://via.placeholder.com/150');
      setSuccess('Image de profil supprimée avec succès.');
      setImageChanged(false); // Réinitialiser l'état de l'image changée
    } catch (error) {
      setError('Erreur lors de la suppression de l\'image de profil.');
      console.error('Erreur de suppression de l\'image :', error);
    }
  };
  

  // Fonction pour convertir le tableau d'octets en base64
  const convertByteArrayToBase64 = (byteArray) => {
    const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return btoa(binaryString); // Encodage en Base64
  };
  
  useEffect(() => {
    loadUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageChanged(true);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
        setError('Tous les champs de mot de passe doivent être remplis.');
        return;
    }

    try {
      // Récupérer le mot de passe encodé du local storage
      const encodedPassword = localStorage.getItem("encodedPassword");

      // Décoder le mot de passe
      const decodedPassword = atob(encodedPassword);

      // Vérifier si l'ancien mot de passe correspond
      if (oldPassword !== decodedPassword) {
          setError("L'ancien mot de passe est incorrect.");
          return;
      }
      if (newPassword.length < 6) {
        setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
        return;
      }

      // Appel de l'API pour changer le mot de passe
      await userService.changeUserPassword(userId, newPassword);

      // Mettre à jour le mot de passe dans le local storage
      const newEncodedPassword = btoa(newPassword);
      localStorage.setItem("encodedPassword", newEncodedPassword);

      setError('');
      setSuccess('Mot de passe mis à jour avec succès.');
      setPasswordChanged(true);
      setIsPasswordEditing(false);
  } catch (error) {
      setError('Une erreur est survenue lors de la mise à jour du mot de passe.');
  }
  };

  const handleSaveImage = async () => {
    if (imageChanged) {
      try {
        const file = document.querySelector('.image-upload').files[0]; // Récupérer le fichier sélectionné
        if (file) {
          await userService.savePhotoToUser(userId, file); // Enregistrer l'image
          setSuccess('Image de profil mise à jour avec succès.');
          setImageChanged(false); // Réinitialiser l'état de l'image changée
        }
      } catch (error) {
        setError('Erreur lors de la mise à jour de l\'image de profil.');
      }
    }
  };

  const handleSaveChanges = () => {
    if (!imageChanged && !passwordChanged) {
      handleShowModal(); 
    } else {
      handleSaveImage();
      window.location.reload();
    }
  };

  return (
    <div className="profil-container">
      <h1 className="profil-titre">Profil</h1>

      <div className="profil-info">
        {/* Image de profil */}
        <div className="profil-item image-section">
          <label className="profil-label">Image de Profil :</label>
          <div className="image-container">
            <img
              src={image || 'https://via.placeholder.com/150'} // Afficher l'image ou un placeholder
              alt="Image de profil"
              className="profil-image"
            />
             <label htmlFor="file-upload" className="custom-file-upload">
              Choisir une image
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="image-upload"
            />
            
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="profil-item">
          <label className="profil-label">Nom :</label>
          <input type="text" value={nom} readOnly className="profil-input" />
        </div>
        <div className="profil-item">
          <label className="profil-label">Prénom :</label>
          <input type="text" value={prenom} readOnly className="profil-input" />
        </div>
        <div className="profil-item">
          <label className="profil-label">Email :</label>
          <input type="text" value={email} readOnly className="profil-input" />
        </div>

        <div className="profil-item">
          <label className="profil-label">Code :</label>
          <input type="text" value={code} readOnly className="profil-input" />
        </div>

        {/* Modifier le mot de passe */}
        <div className="profil-item">
          <button
            onClick={() => setIsPasswordEditing(!isPasswordEditing)}
            className="edit-password-button"
          >
            {isPasswordEditing ? 'Annuler' : 'Modifier le mot de passe'}
          </button>
        </div>

        {/* Formulaire de modification du mot de passe */}
        {isPasswordEditing && (
          <>
            <div className="profil-item">
              <label className="profil-label">Ancien Mot de Passe :</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="profil-input"
              />
            </div>
            <div className="profil-item">
              <label className="profil-label">Nouveau Mot de Passe :</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="profil-input"
              />
            </div>
            <div className="profil-item">
              <button onClick={handlePasswordChange} className="update-password-button">
                Sauvegarder le mot de passe
              </button>
            </div>
          </>
        )}

        {/* Messages d'erreur ou de succès */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Bouton pour sauvegarder les modifications */}
        <div className="profil-item">
          <button onClick={handleSaveChanges} className="save-button">
            Sauvegarder les modifications
          </button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Aucun changement détecté</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Il semble que vous n'avez effectué aucune modification. Veuillez modifier les informations pour sauvegarder.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profil;
