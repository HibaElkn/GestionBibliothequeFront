import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaBell, FaCalendarAlt, FaBook, FaUser } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';

// Registering the necessary chart elements
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
      <div className="main" style={{ marginLeft: '250px' }}> {/* Ajout de la marge à gauche */}
        <div className="stats-cards d-flex justify-content-around mt-4">
          <div className="card shadow p-3">
            <h5>Livres empruntés ce mois</h5>
            <FaBook className="icon" />
            <p>80</p> {/* Nombre d'emprunts */}
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

        <div className="chart mt-5">
          <h5 className="mb-4">Graphique des Livres Empruntés vs Retournés</h5>
          <Line data={lineData} />
        </div>

        <div className="stats-cards d-flex justify-content-around mt-4">
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
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
