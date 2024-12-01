import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../assets/Fsts.png';
import { Link } from 'react-router-dom'; 
import { getUserByEmail } from '../services/userService'; // Importer le service
import { getEmailFromToken } from '../services/authService'; // Importer le service d'authentification

const Header = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasNotification, setHasNotification] = useState(false); // État pour gérer les notifications
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
  const [email, setEmail] = useState(null); // État pour l'email de l'utilisateur
  const [notifications, setNotifications] = useState([]); // État pour stocker la liste des notifications
  const [showNotifications, setShowNotifications] = useState(false); // État pour afficher/masquer les notifications

  // Utiliser useEffect pour extraire l'email du token et récupérer les informations utilisateur
  useEffect(() => {
    const emailFromToken = getEmailFromToken(); // Extraire l'email du token
    setEmail(emailFromToken); // Mettre à jour l'email

    if (emailFromToken) {
      const fetchUser = async () => {
        const userData = await getUserByEmail(emailFromToken); // Appel de la fonction pour récupérer l'utilisateur
        if (userData) {
          setUser(userData); // Mettre à jour l'état avec les données de l'utilisateur
        }
      };
      fetchUser();
    }

    // Ajoutez ici un gestionnaire de clic pour fermer les détails du profil si l'utilisateur clique en dehors
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [email]); // Déclenche l'effet chaque fois que l'email change

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
    setShowNotifications(!showNotifications); // Change l'état pour afficher/masquer les notifications
    if (notifications.length > 0) {
      setHasNotification(false); // Réinitialiser le badge des notifications une fois consultées
    }
  };

  // Exemple de notifications avec URL associée
  useEffect(() => {
    // Simule des notifications reçues avec des liens vers différentes pages
    setNotifications([
      { id: 1, message: 'Nouveau livre ajouté: "Les Voyageurs"', time: '2 min ago', url: '/gestion-livre' },
      { id: 2, message: 'Retour de livre en retard: "Le Grand Livre"', time: '5 min ago', url: '/gestion-retours' },
      { id: 3, message: 'Emprunt d\'un livre par l\'utilisateur: "Jean Dupont"', time: '15 min ago', url: '/gestion-emprunts' },
      { id: 4, message: 'Nouvelle réservation pour "Le Petit Prince"', time: '20 min ago', url: '/gestion-reservation' }, // Exemple de réservation
    ]);
    if (notifications.length > 0) {
      setHasNotification(true); // Activer le badge si des notifications sont disponibles
    }
  }, [notifications.length]);

  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />

      <form className="search-container" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="search-bar" 
          value={searchTerm}
          onChange={handleSearchChange} 
        />
        <i className="fas fa-search search-icon"></i> 
      </form>

      <div className="notifications-container" onClick={toggleNotification}>
        <i
          className={`fas fa-bell notification-icon-outline ${hasNotification ? 'has-notification' : ''}`}
        />
        {hasNotification && <div className="notification-dot"></div>}
      </div>

      {/* Notifications Dropdown style Facebook */}
      {showNotifications && (
        <div className="notification-dropdown">
          <h5>Notifications</h5>
          {notifications.length === 0 ? (
            <p>Aucune notification</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  {/* Vérifie si le message contient "réservation" pour rediriger vers la page de réservation */}
                  <Link to={notification.message.toLowerCase().includes('réservation') ? '/gestion-reservations' : notification.url}>
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
        <Link to="/profil">
          <i className="fas fa-user-circle profile-icon"></i> 
        </Link>
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
