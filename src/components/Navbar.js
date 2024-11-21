import React, { useState } from 'react';
import '../styles/Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showUsersSubMenu, setShowUsersSubMenu] = useState(false);
  const [showEmpruntsSubMenu, setShowEmpruntsSubMenu] = useState(false);

  const location = useLocation(); 

  const toggleUsersSubMenu = () => {
    setShowUsersSubMenu(!showUsersSubMenu);
  };

  const toggleEmpruntsSubMenu = () => {
    setShowEmpruntsSubMenu(!showEmpruntsSubMenu);
  };


  return (
    <div id="nav-bar">
      <input id="nav-toggle" type="checkbox" />
      <div id="nav-header">
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
      </div>

      <div id="nav-content">
        {/* Gestion des utilisateurs avec sous-menu */}
        <div
          className="nav-button nav-button-management"
          onClick={toggleUsersSubMenu}
          aria-expanded={showUsersSubMenu}
          aria-controls="users-sub-menu"
        >
          <i className="fas fa-users"></i>
          <span>Utilisateurs</span>
        </div>
        {showUsersSubMenu && (
          <div id="users-sub-menu" className="sub-menu">
            <Link to="/gestion-etudiants" className="sub-menu-item">
              <i className="fas fa-graduation-cap"></i> Étudiants
            </Link>
            <Link to="/gestion-Admin" className="sub-menu-item">
              <i className="fas fa-user-shield"></i> Admins
            </Link>
            <Link to="/gestion-personnel" className="sub-menu-item">
              <i className="fas fa-users-cog"></i> Personnel
            </Link>
          </div>
        )}

        {/* Gestion des emprunts avec sous-menu */}
        <div
          className="nav-button nav-button-management"
          onClick={toggleEmpruntsSubMenu}
          aria-expanded={showEmpruntsSubMenu}
          aria-controls="emprunts-sub-menu"
        >
          <i className="fas fa-calendar-check"></i>
          <span>Emprunts & réservations</span>
        </div>
        {showEmpruntsSubMenu && (
          <div id="emprunts-sub-menu" className="sub-menu">
            <Link to="/gestion-emprunts" className="sub-menu-item">
              <i className="fas fa-book-reader"></i> Emprunts
            </Link>
            <Link to="/gestion-reservations" className="sub-menu-item">
              <i className="fas fa-bookmark"></i> Réservations
            </Link>
          </div>
        )}

        {/* Autres liens */}
        <Link to="/gestion-livre" className="nav-button nav-button-management">
          <i className="fas fa-book-open"></i>
          <span>Livres</span>
        </Link>

        <Link to="/dashboard" className="nav-button nav-button-management">
          <i className="fas fa-tachometer-alt"></i>
          <span>Tableau de bord</span>
        </Link>
      </div>

      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <Link to="/login" className="logout-button" 
          style={{
            border: 'none',             
            padding: '10px 20px',        
            borderRadius: '5px',        
            fontSize: '16px',            
          }}
        >
       <i className="fas fa-sign-out-alt" style={{ color: '#f39c12' }}></i> 
          <span>Déconnexion</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;