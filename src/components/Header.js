import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../assets/Fsts.png';
import { Link } from 'react-router-dom';
import NotificationComponent from '../pages/NotificationComponent'; // Import the NotificationComponent
import { getUserByEmail } from '../services/userService'; // Import user service
import { getEmailFromToken } from '../services/authService'; // Import authentication service

const Header = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null); // State to store user information
  const [email, setEmail] = useState(null); // State to store user email

  // Extract the email from the token and fetch user data
  useEffect(() => {
    const emailFromToken = getEmailFromToken(); // Extract email from token
    setEmail(emailFromToken); // Update email state

    if (emailFromToken) {
      const fetchUser = async () => {
        const userData = await getUserByEmail(emailFromToken); // Fetch user data
        if (userData) {
          setUser(userData); // Update user state with data
        }
      };
      fetchUser();
    }

    // Add event listener for clicks outside profile details
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

      {/* Notification Component */}
      <NotificationComponent />

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
