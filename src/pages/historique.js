import React, { useState, useEffect } from 'react';
import '../styles/Historique.css';

const Historique = () => {
  const [emprunts, setEmprunts] = useState([]);

  // Simuler l'appel à une API pour récupérer les emprunts de l'utilisateur
  useEffect(() => {
    const fetchEmprunts = async () => {
      // Remplacez par votre logique pour récupérer les emprunts depuis un backend
      const data = [
        {
          id: 1,
          titre: 'Le Seigneur des Anneaux',
          dateEmprunt: '2024-01-15',
          dateRetour: '2024-02-15',
        },
        {
          id: 2,
          titre: '1984',
          dateEmprunt: '2024-03-01',
          dateRetour: '2024-03-30',
        },
        {
          id: 3,
          titre: 'La Peste',
          dateEmprunt: '2024-05-10',
          dateRetour: '2024-06-10',
        },
      ];
      setEmprunts(data);
    };

    fetchEmprunts();
  }, []);

  return (
    <div className="historique-emprunts-container">
      <h1 className="titre-historique">Historique des Emprunts</h1>
      {emprunts.length === 0 ? (
        <p>Aucun emprunt trouvé.</p>
      ) : (
        <table className="table-historique">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date d'Emprunt</th>
              <th>Date de Retour</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => (
              <tr key={emprunt.id}>
                <td>{emprunt.titre}</td>
                <td>{emprunt.dateEmprunt}</td>
                <td>{emprunt.dateRetour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Historique;
