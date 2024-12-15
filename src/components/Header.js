import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../assets/Fsts.png';
import { Link } from 'react-router-dom'; 
import { getUserByEmail, getPhotoByUserId } from '../services/userService'; // Importer les services
import { getEmailFromToken } from '../services/authService'; // Importer le service d'authentification

const Header = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasNotification, setHasNotification] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // État pour stocker l'image de profil
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Utiliser useEffect pour charger les données utilisateur et l'image de profil
  useEffect(() => {
    const emailFromToken = getEmailFromToken(); // Extraire l'email du token
    setEmail(emailFromToken);

    if (emailFromToken) {
      const fetchUser = async () => {
        const userData = await getUserByEmail(emailFromToken); // Récupérer les infos utilisateur
        if (userData) {
          setUser(userData);

          // Récupérer l'image de profil si elle existe
          const userImage = await getPhotoByUserId(userData.id);
          if (userImage) {
            const blob = new Blob([userImage], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setProfileImage(imageUrl);
          }
        }
      };
      fetchUser();
    }

    // Gestion des clics extérieurs pour fermer les détails du profil
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [email]);

  const handleProfileClick = () => {
    setShowProfileDetails(!showProfileDetails);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.profile-container')) {
      setShowProfileDetails(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Recherche pour:', searchTerm);
  };

  const toggleNotification = () => {
    setShowNotifications(!showNotifications);
    if (notifications.length > 0) {
      setHasNotification(false);
    }
  };

  // Exemple de notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'Nouveau livre ajouté: "Les Voyageurs"', time: '2 min ago', url: '/gestion-livre' },
      { id: 2, message: 'Retour de livre en retard: "Le Grand Livre"', time: '5 min ago', url: '/gestion-retours' },
    ]);
    if (notifications.length > 0) {
      setHasNotification(true);
    }
  }, [notifications.length]);

  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />

      <div className="notifications-container" onClick={toggleNotification}>
        <i
          className={`fas fa-bell notification-icon-outline ${hasNotification ? 'has-notification' : ''}`}
        />
        {hasNotification && <div className="notification-dot"></div>}
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          <h5>Notifications</h5>
          {notifications.length === 0 ? (
            <p>Aucune notification</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <Link to={notification.url}>
                    <p>{notification.message}</p>
                  </Link>
                  <span>{notification.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

<div className="profile-container" onClick={handleProfileClick}>
  {profileImage ? (
    <Link to="/profil">
      <img src={profileImage} alt="Image de profil" className="profile-image" />
    </Link>
  ) : (

    <Link to="/profil">
       <i className="fas fa-user-circle profile-icon"></i>
    </Link>
   
  )}
  <span className="profile-name">{user ? `${user.nom} ${user.prenom}` : 'Chargement...'}</span>
  {showProfileDetails && user && (
    <div className="profile-details">
      <p><strong>Nom:</strong> {user.nom}</p>
      <p><strong>Prénom:</strong> {user.prenom}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Code:</strong> {user.code}</p>
    </div>
  )}
</div>
    </div>
  );
};

export default Header;
