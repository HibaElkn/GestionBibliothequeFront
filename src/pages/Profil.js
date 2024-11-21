import React, { useState } from 'react';
import '../styles/Profil.css';

const Profil = () => {
  const [image, setImage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [cne, setCne] = useState('123456789'); // Exemple de CNE (non modifiable)
  const [nom, setNom] = useState('VotreNom'); // Exemple de nom
  const [prenom, setPrenom] = useState('VotrePrénom'); // Exemple de prénom
  const [email, setEmail] = useState('test@example.com'); // Exemple d'email

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageChanged(true); // Marquer l'image comme modifiée
    }
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword) {
      setError('Tous les champs de mot de passe doivent être remplis.');
    } else {
      setError('');
      setPasswordChanged(true); // Marquer le mot de passe comme modifié
      alert('Mot de passe mis à jour avec succès.');
      setIsPasswordEditing(false); // Fermer la modification du mot de passe
    }
  };

  const handleSaveChanges = () => {
    if (imageChanged || passwordChanged) {
      alert('Changements enregistrés !');
      // Implémenter la logique pour sauvegarder les changements ici
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

        {/* Informations de l'utilisateur */}
        <div className="profil-item">
          <label className="profil-label">Nom :</label>
          <input
            type="text"
            value={nom}
            readOnly
            className="profil-input"
          />
        </div>
        <div className="profil-item">
          <label className="profil-label">Prénom :</label>
          <input
            type="text"
            value={prenom}
            readOnly
            className="profil-input"
          />
        </div>
        <div className="profil-item">
          <label className="profil-label">Email :</label>
          <input
            type="text"
            value={email}
            readOnly
            className="profil-input"
          />
        </div>

        

        <div className="profil-item">
          <label className="profil-label">CNE :</label>
          <input
            type="text"
            value={cne}
            readOnly
            className="profil-input"
          />
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
            {/* Affichage des erreurs */}
            {error && <p className="error-message">{error}</p>}
          </>
        )}

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
