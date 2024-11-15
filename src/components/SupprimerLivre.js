import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SupprimerLivre = ({ onConfirm }) => {
  const { id } = useParams();  // Get the 'id' from the route params
  const navigate = useNavigate();  // For navigation after delete

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      onConfirm(id);  // Call the onConfirm function passed as a prop
      navigate("/gestion-livre");  // Navigate back to the gestion-livre page after deletion
    }
  };

  return (
    <div>
      <h3>Êtes-vous sûr de vouloir supprimer ce livre ?</h3>
      <button onClick={handleDelete}>Supprimer</button>
      <button onClick={() => navigate("/gestion-livre")}>Annuler</button>
    </div>
  );
};

export default SupprimerLivre;
