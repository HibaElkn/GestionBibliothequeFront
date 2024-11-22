import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate} from 'react-router-dom';
import GestionEtudiants from './pages/GestionEtudiants';
import GestionPersonnel from './pages/GestionPersonnel';
import GestionAdmin from './pages/GestionAdmin';
import GestionBibliothecaires from './pages/GestionBibliothecaires';
import Login from './pages/LoginPage';
import Navbar from './components/Navbar'; // Utilisation uniquement de Navbar
import Header from './components/Header';
import AjouterLivre from './components/AjouterLivre';
import EditLivre from './components/EditLivre';
import SupprimerLivre from './components/SupprimerLivre';
import ParentComponent from './components/ParentComponent';
import GestionEmprunts from './pages/GestionEmprunts';
import UserInterface from './pages/UserInterface';
import GestionReservations from './pages/GestionReservations';

import Historique from './pages/historique';
import './App.css'; 
import Profil from './pages/Profil';
import MesReservations from './pages/MesReservations';

const AppContent = ({ handleDelete }) => {
  const location = useLocation();

  // Définir les routes spécifiques
  const hideNavbarAndHeaderRoutes = ['/login'];

  const shouldHideNavbarAndHeader = hideNavbarAndHeaderRoutes.includes(location.pathname);

  return (
    <>
      {/* Header et Navbar conditionnels */}
      {!shouldHideNavbarAndHeader && <Header />}
      {!shouldHideNavbarAndHeader && <Navbar />} {/* Navbar affichée pour toutes les pages sauf login */}

      {/* Contenu principal */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} /> 
          <Route path="/gestion-personnel" element={<GestionPersonnel />} />
          <Route path="/gestion-etudiants" element={<GestionEtudiants />} />
          <Route path="/gestion-bibliothecaires" element={<GestionBibliothecaires />} />
          <Route path="/gestion-Admin" element={<GestionAdmin />} />
          <Route path="/gestion-livre" element={<ParentComponent />} />
          <Route path="/gestion-emprunts" element={<GestionEmprunts />} />
          <Route path="/gestion-reservations" element={<GestionReservations />} />
          <Route path="/user-interface" element={<UserInterface />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
          <Route path="/ajouter-livre" element={<AjouterLivre onClose={() => {}} />} />
          <Route path="/modifier-livre/:id" element={<EditLivre />} />
          <Route
            path="/supprimer-livre/:id"
            element={<SupprimerLivre onConfirm={handleDelete} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  const handleDelete = (id) => {
    console.log("Suppression du livre avec l'id :", id);
  };

  return (
    <Router>
      <AppContent handleDelete={handleDelete} />
    </Router>
  );
};

export default App;
