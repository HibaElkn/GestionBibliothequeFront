// components/Navbar.js
import React from 'react';
import '../styles/Navbar.css'; // CSS spécifique pour ce composant
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom

const Navbar = () => {
  return (
    <div id="nav-bar">
      <input id="nav-toggle" type="checkbox" />
      <div id="nav-header">
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
      </div>

      <div id="nav-content">
        <Link to="/gestion-etudiants" className="nav-button nav-button-management">
          <i className="fas fa-user-graduate"></i> {/* Icon for student management */}
          <span>Gestion des étudiants</span>
        </Link>
        <Link to="/gestion-personnel" className="nav-button nav-button-management">
          <i className="fas fa-users"></i> {/* Icon for personnel management */}
          <span>Gestion du personnel</span>
        </Link>
        <Link to="/gestion-admin" className="nav-button nav-button-management">
          <i className="fas fa-user-shield"></i> {/* Icon for admin management */}
          <span>Gestion des administrateurs</span>
        </Link>
        <Link to="/gestion-bibliothecaires" className="nav-button nav-button-management">
          <i className="fas fa-id-card-alt"></i> {/* Icon for librarian management */}
          <span>Gestion des bibliothécaires</span>
        </Link>
        <hr />
        <Link to="/gestion-livre" className="nav-button nav-button-management">
          <i className="fas fa-book-open"></i>
          <span>Gestion des livres</span>
        </Link>
        <Link to="/gestion-emprunts" className="nav-button nav-button-management">
          <i className="fas fa-book-reader"></i> {/* Icône pour la gestion des emprunts */}
          <span>Gestion des emprunts</span>
        </Link>
        {/* Nouvelle section pour la gestion des réservations */}
        <Link to="/gestion-reservations" className="nav-button nav-button-management">
          <i className="fas fa-calendar-check"></i> {/* Icône pour la gestion des réservations */}
          <span>Gestion des réservations</span>
        </Link>
        <hr />
        <Link to="/dashboard" className="nav-button nav-button-management">
          <i className="fas fa-tachometer-alt"></i> {/* Icon for dashboard */}
          <span>Tableau de bord</span>
        </Link>

        <hr />
        <div id="nav-content-highlight"></div>
      </div>

      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <Link to="/logout" className="nav-button">
          <i className="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
