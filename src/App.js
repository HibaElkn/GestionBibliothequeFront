// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import GestionEtudiants from './pages/GestionEtudiants';
import GestionPersonnel from './pages/GestionPersonnel';
import GestionAdmin from './pages/GestionAdmin';
import GestionBibliothecaires from './pages/GestionBibliothecaires';
import GestionLivre from './pages/GestionLivres';
import Login from './pages/LoginPage';
import Navbar from './components/Navbar';
import Header from './components/Header';
import AjouterLivre from './components/AjouterLivre';
import EditLivre from './components/EditLivre';
import SupprimerLivre from './components/SupprimerLivre';
import ParentComponent from './components/ParentComponent';
import GestionEmprunts from './pages/GestionEmprunts';
import UserInterface from './pages/UserInterface';
import GestionReservations from './pages/GestionReservations';

const AppContent = ({ handleDelete }) => {
  const location = useLocation();

  return (
    <>
      <Header />
      {/* Affichez Navbar uniquement si la route n'est pas "/user-interface" */}
      {location.pathname !== '/user-interface' && <Navbar />}
      <Routes>
        <Route path="/gestion-personnel" element={<GestionPersonnel />} />
        <Route path="/gestion-etudiants" element={<GestionEtudiants />} />
        <Route path="/gestion-bibliothecaires" element={<GestionBibliothecaires />} />
        <Route path="/gestion-Admin" element={<GestionAdmin />} />
        <Route path="/gestion-livre" element={<ParentComponent />} />
        <Route path="/gestion-emprunts" element={<GestionEmprunts />} />
        <Route path="/gestion-reservations" element={<GestionReservations/>} />
        <Route path="/user-interface" element={<UserInterface />} />
        <Route path="/ajouter-livre" element={<AjouterLivre onClose={() => {}} />} />
        <Route path="/ajouter-livre" element={<ParentComponent />} />
        <Route path="/modifier-livre/:id" element={<EditLivre />} />
        <Route
          path="/supprimer-livre/:id"
          element={<SupprimerLivre onConfirm={handleDelete} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
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
