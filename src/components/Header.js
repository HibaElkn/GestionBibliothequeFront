import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../assets/Fsts.png';
import { Link } from 'react-router-dom'; 
const Header = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasNotification, setHasNotification] = useState(false); // État pour gérer les notifications

  const handleProfileClick = () => {
    setShowProfileDetails(!showProfileDetails);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.profile-container')) {
      setShowProfileDetails(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Recherche pour:', searchTerm);
  };

  const toggleNotification = () => {
    setHasNotification(!hasNotification); // Change l'état des notifications
  };

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

        <div className="profile-container" onClick={handleProfileClick}>
        <Link to="/profil">
 <i className="fas fa-user-circle profile-icon"></i> </Link>
          <span className="profile-name">NOM PRENOM</span>
          {showProfileDetails && (
            <div className="profile-details">
              <p><strong>Nom:</strong> VotreNom</p>
              <p><strong>Prénom:</strong> VotrePrénom</p>
              <p><strong>Email:</strong> email@example.com</p>
              <p><strong>Code:</strong> Code123</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default Header;
