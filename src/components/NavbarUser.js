import React, { useState } from 'react';
import '../styles/Navbar.css';  
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const NavbarUser = () => {
  return (
    <div id="nav-bar">
      <div id="nav-content">
        {/* Section Historique */}
        <Link to="/historique" className="nav-button">
          <i className="fas fa-history"></i>
          <span>Historique</span>
        </Link>

        {/* Section Mes Emprunts */}
        <Link to="/mes-reservations" className="nav-button">
          <i className="fas fa-calendar-check"></i>
          <span>Mes reservations</span>
        </Link>

        {/* Section Catalogue */}
        <Link to="/user-interface" className="nav-button">
          <i className="fas fa-book"></i>
          <span>Catalogue</span>
        </Link>
      </div>

      <div id="nav-footer">
        {/* Déconnexion */}
        <Link to="/logout" className="logout-button"
        style={{
          backgroundColor: '#004079ff',  
          color: '#D99A22ff',             
          border: 'none',              
          padding: '10px 20px',        
          borderRadius: '5px',         
          }}
        >
          <i className="fas fa-sign-out-alt" style={{ color: '#D99A22ff' }}></i>

          <span>Déconnexion</span>
        </Link>
      </div>
    </div>
  );
};

export default NavbarUser;
