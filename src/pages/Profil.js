import React, { useState, useEffect } from 'react';
import '../styles/Profil.css';
import authService from '../services/authService';
import userService from '../services/userService';

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

  // Charger les données utilisateur
  const loadUserData = async () => {
    const emailFromToken = authService.getEmailFromToken(); // Extraire l'email du token
    setEmail(emailFromToken);

    try {
      const user = await userService.getUserByEmail(emailFromToken);
      setNom(user.nom);
      setPrenom(user.prenom);
      setCode(user.code);
      setUserId(user.id); // Stocker l'ID utilisateur pour les mises à jour
    } catch (error) {
      setError("Impossible de récupérer les informations utilisateur.");
    }
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


  const handleSaveChanges = () => {
    if (imageChanged || passwordChanged) {
      alert('Changements enregistrés !');
      // Implémenter la logique pour sauvegarder les autres changements ici
    } else {
      alert('Aucun changement détecté.');
    }
  };

  return (
    <div className="profil-container">
      <h1 className="profil-titre">Profil Utilisateur</h1>

      <div className="profil-info">
        {/* Image de profil */}
        <div className="profil-item image-section">
          <label className="profil-label">Image de Profil :</label>
          <div className="image-container">
            <img
              src={image || 'https://via.placeholder.com/150'}
              alt="Image de profil"
              className="profil-image"
            />
            <input
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
    </div>
  );
};

export default Profil;
