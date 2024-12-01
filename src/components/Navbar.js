import React, { useState } from 'react';
import '../styles/Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Importation du service auth

const Navbar = () => {
  const [showUsersSubMenu, setShowUsersSubMenu] = useState(false);
  const [showEmpruntsSubMenu, setShowEmpruntsSubMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleUsersSubMenu = () => {
    setShowUsersSubMenu(!showUsersSubMenu);
  };

  const toggleEmpruntsSubMenu = () => {
    setShowEmpruntsSubMenu(!showEmpruntsSubMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('access-token'); // Suppression du token
    navigate('/login'); // Redirige vers la page de login
  };

  // Vérification des rôles via le service auth
  const isBibliothecaire = authService.isBibliothecaire();
  const isEtudiant = authService.isEtudiant();
  const isAdmin = authService.isAdminScope();
  const isPersonnel = authService.isPersonnel();

  return (
    <div id="nav-bar">
      <input id="nav-toggle" type="checkbox" />
      <div id="nav-header">
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
      </div>

      <div id="nav-content">
        {/* Tableau de bord accessible uniquement aux Admins et Bibliothécaires */}
        {(isAdmin || isBibliothecaire) && (
          <Link to="/dashboard" className="nav-button nav-button-management">
            <i className="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </Link>
        )}

        {/* Admin : Accès */}
        {isAdmin && (
          <>
            <Link to="/gestion-etudiants" className="nav-button nav-button-management">
              <i className="fas fa-users"></i>
              <span>Gestion Étudiants</span>
            </Link>
            <Link to="/gestion-personnel" className="nav-button nav-button-management">
              <i className="fas fa-users-cog"></i>
              <span>Gestion Personnel</span>
            </Link>
            <Link to="/gestion-Admin" className="nav-button nav-button-management">
              <i className="fas fa-user-shield"></i>
              <span>Gestion Admins</span>
            </Link>
            <Link to="/gestion-bibliothecaires" className="nav-button nav-button-management">
              <i className="fas fa-users-cog"></i>
              <span>Gestion Bibliothécaires</span>
            </Link>
          </>
        )}

        {/* Bibliothécaire : Accès à la gestion des livres, réservations, emprunts */}
        {isBibliothecaire && (
          <>
            <Link to="/gestion-livre" className="nav-button nav-button-management">
              <i className="fas fa-book-open"></i>
              <span>Gestion des Livres</span>
            </Link>
            <Link to="/gestion-reservations" className="nav-button nav-button-management">
              <i className="fas fa-bookmark"></i>
              <span>Gestion des Réservations</span>
            </Link>
            <Link to="/gestion-emprunts" className="nav-button nav-button-management">
              <i className="fas fa-calendar-check"></i>
              <span>Gestion des Emprunts</span>
            </Link>
            <Link to="/gestion-retours" className="nav-button nav-button-management">
            <i className="fas fa-sync-alt"></i>
              <span>Gestion des retours</span>
            </Link>
          </>
        )}

        {/* Étudiant et Personnel : Accès au catalogue et à leurs emprunts */}
        {(isEtudiant || isPersonnel) && (
          <>
          {/* Section Catalogue */}
          <Link to="/user-interface" className="nav-button">
            <i className="fas fa-book"></i>
            <span>Catalogue</span>
          </Link>
           {/* Section Mes Emprunts */}
           <Link to="/mes-reservations" className="nav-button">
            <i className="fas fa-calendar-check"></i>
            <span>Mes reservations</span>
          </Link>
          </>
        )}

        {/* Étudiant et Personnel : Accès au catalogue et à leurs emprunts */}
        {(isBibliothecaire || isPersonnel || isEtudiant) && (
          <>
          {/* Section historique */}
          <Link to="/historique" className="nav-button">
           <i className="fas fa-history"></i>
           <span>Historique</span>
          </Link>
          </>
        )}

        
      </div>

      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <Link to="/login" onClick={handleLogout} className="logout-button"
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
