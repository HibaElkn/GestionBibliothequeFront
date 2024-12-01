import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaCalendarAlt, FaBook } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';

// Enregistrement des éléments nécessaires pour les graphiques
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Simuler les données des retours de livres
  const retoursData = [
    { cne: '123456', titreLivre: 'Le Grand Livre', dateRetour: '2024-11-25', dateLimite: '2024-11-24' },
    { cne: '234567', titreLivre: 'Les Mystères de l\'univers', dateRetour: '2024-11-26', dateLimite: '2024-11-24' },
    { cne: '345678', titreLivre: 'Le Voyage Extraordinaire', dateRetour: '2024-11-27', dateLimite: '2024-11-24' },
    { cne: '456789', titreLivre: 'L\'Art de la Guerre', dateRetour: '2024-11-28', dateLimite: '2024-11-24' },
    { cne: '567890', titreLivre: 'Les Fleurs du Mal', dateRetour: '2024-11-29', dateLimite: '2024-11-24' },
    { cne: '678901', titreLivre: '1984', dateRetour: '2024-11-30', dateLimite: '2024-11-24' },
    { cne: '789012', titreLivre: 'Les Misérables', dateRetour: '2024-12-01', dateLimite: '2024-11-24' },
  ];

  // Calcul de la durée moyenne des retards
  const calculateAverageLateDuration = () => {
    const totalLateDuration = retoursData.reduce((acc, retour) => {
      const returnDate = new Date(retour.dateRetour);
      const dueDate = new Date(retour.dateLimite);
      const timeDifference = returnDate - dueDate; // Différence entre la date de retour et la date limite
      const lateDays = Math.floor(timeDifference / (1000 * 3600 * 24));
      return acc + (lateDays > 0 ? lateDays : 0); // Ne compte que les jours de retard (positifs)
    }, 0);
    return retoursData.length ? (totalLateDuration / retoursData.length).toFixed(1) : 0; // Moyenne des jours de retard
  };

  const doughnutData = {
    labels: ['Livres empruntés', 'Livres disponibles'],
    datasets: [
      {
        data: [80, 120], // Exemple de données
        backgroundColor: ['#FFA726', '#FFF3E0'],
        hoverBackgroundColor: ['#FF9800', '#FFE0B2'],
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr'],
    datasets: [
      {
        label: 'Livres empruntés',
        data: [150, 200, 180, 220],
        fill: true,
        backgroundColor: 'rgba(30, 136, 229, 0.2)',
        borderColor: '#1E88E5',
        tension: 0.4,
      },
      {
        label: 'Livres retournés',
        data: [120, 150, 170, 180],
        borderColor: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="main" style={{ marginLeft: '250px' }}>
        {/* 1ère ligne avec 3 cartes */}
        <div className="stats-cards d-flex justify-content-between mt-4">
          <div className="card shadow p-3">
            <h5>Livres empruntés ce mois</h5>
            <FaBook className="icon" />
            <p>80</p>
          </div>
          <div className="card shadow p-3">
            <h5>Livres disponibles</h5>
            <Doughnut data={doughnutData} />
          </div>
          <div className="card shadow p-3">
            <h5>Emprunts en cours</h5>
            <p>Nombre d'emprunts en cours</p>
            <div className="progress">
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '65%' }}
              >
                65%
              </div>
            </div>
          </div>
        </div>

        {/* 2ème ligne avec 3 cartes */}
        <div className="stats-cards d-flex justify-content-between mt-4">
          <div className="card shadow p-3">
            <h5>Top Livres Empruntés</h5>
            <ul>
              <li>1. "Livre A" - 45 emprunts</li>
              <li>2. "Livre B" - 40 emprunts</li>
              <li>3. "Livre C" - 35 emprunts</li>
            </ul>
          </div>
          <div className="card shadow p-3">
            <h5>Retours de livres</h5>
            <FaCalendarAlt className="icon" />
            <p>30 Retours ce mois-ci</p>
          </div>
          <div className="card shadow p-3">
            <h5>Durée Moyenne des Retards</h5>
            <p>{calculateAverageLateDuration()} jours</p>
          </div>
        </div>

        <div className="charts mt-5">
          <h5 className="mb-4">Graphique des Livres Empruntés vs Retournés</h5>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
