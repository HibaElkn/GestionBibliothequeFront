import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaCalendarAlt, FaBook } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';
import { getToken } from '../services/authService'; 
import { getAllEmprunts, updateStatut } from '../services/empruntService';

// Register necessary components for Chart.js
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
  const [livresEmpruntesCount, setLivresEmpruntesCount] = useState(0); // Books borrowed this month
  const [empruntsEnCours, setEmpruntsEnCours] = useState([]); // Current loans
  const [topDocuments, setTopDocuments] = useState([]); // Top borrowed documents
  const [documentStats, setDocumentStats] = useState({ borrowed: 0, available: 0 }); // Borrowed vs available
  const [countCurrentMonth, setCountCurrentMonth] = useState(0);

  useEffect(() => {
    const token = getToken();
  
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const fetchData = async () => {
      try {
        const emprunts = await getAllEmprunts();
    
        const empruntsRetourner = emprunts.filter((emprunt) => emprunt.statut === 'RETOURNER');
    
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        const countCurrentMonth = empruntsRetourner.filter((emprunt) => {
          const dateEmprunt = new Date(emprunt.dateEmprunt);
          return dateEmprunt.getMonth() === currentMonth && dateEmprunt.getFullYear() === currentYear;
        }).length;
    
        console.log(`Number of loans with status 'RETOURNER' in the current month: ${countCurrentMonth}`);
    
        // Set the value in state
        setCountCurrentMonth(countCurrentMonth);
    
        // Log the state value after setting it (since state updates are async)
        console.log('State countCurrentMonth after setState:', countCurrentMonth);
    
        const empruntsEnAttente = emprunts.filter((emprunt) => emprunt.statut === 'ATTENTE');
        setEmpruntsEnCours(empruntsEnAttente);
    
        console.log('Filtered emprunts with statut = "ATTENTE":', empruntsEnAttente);
    
        const endpoints = [
          'http://localhost:8080/api/emprunts/count-this-month',
          'http://localhost:8080/api/emprunts/emprunts/en-cours',
          'http://localhost:8080/api/emprunts/documents/statistiques',
        ];
    
        const responses = await Promise.all(
          endpoints.map((url) =>
            fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
    
        const data = await Promise.all(
          responses.map(async (response, index) => {
            if (!response.ok) {
              const text = await response.text();
              console.error(`Error from ${endpoints[index]}: ${response.status} - ${text}`);
              throw new Error(`API error: ${response.status}`);
            }
            return await response.json();
          })
        );
    
        setLivresEmpruntesCount(data[0] || 0);
        
        // Log `livresEmpruntesCount` after updating state
        console.log(`Number of livres empruntés count: ${data[0]}`);
    
        setDocumentStats(data[2] || { borrowed: 0, available: 0 });
    
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    
    fetchData();
    
  }, []);
  
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
// Doughnut chart data
const doughnutData = {
  labels: ['Livres empruntés', 'Livres disponibles'],
  datasets: [
    {
      data: [
        empruntsEnCours.filter((emprunt) => ['ATTENTE', 'RETARD'].includes(emprunt.statut)).length,
        empruntsEnCours.filter((emprunt) => emprunt.statut === 'RETOURNER').length
      ],
      backgroundColor: ['#FFA726', '#FFF3E0'],
      hoverBackgroundColor: ['#FF9800', '#FFE0B2'],
    }
  ],
};


  // Example line chart data
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr'], // Example months
    datasets: [
      {
        label: 'Livres empruntés',
        data: [150, 200, 180, 220], // Example data
        fill: true,
        backgroundColor: 'rgba(30, 136, 229, 0.2)',
        borderColor: '#1E88E5',
        tension: 0.4,
      },
      {
        label: 'Livres retournés',
        data: [120, 150, 170, 180], // Example data
        borderColor: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="main" style={{ marginLeft: '250px' }}>
        
        {/* First row with three cards */}
        <div className="stats-cards d-flex justify-content-between mt-4">
          <div className="card shadow p-3">
            <h5>Livres empruntés ce mois</h5>
            <FaBook className="icon" />
            <p>{livresEmpruntesCount}</p>
          </div>
          <div className="card shadow p-3">
            <h5>Livres disponibles</h5>
            <Doughnut data={doughnutData} />
          </div>
          <div className="card shadow p-3">
            <h5>Emprunts en cours</h5>
            <p>{empruntsEnCours.length} emprunts en cours</p>
            <div className="progress">
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${(empruntsEnCours.length / 100) * 100}%` }}
              >
                {(empruntsEnCours.length / 100) * 100}%
              </div>
            </div>
          </div>
        </div>

        
        {/* Second row with three cards */}
        <div className="stats-cards d-flex justify-content-between mt-4">
          <div className="card shadow p-3">
            <h5>Top Livres Empruntés</h5>
            <ul>
    {topDocuments.map((item, index) => (
      <li key={index}>
        {item.document?.titre} - {item.empruntCount} emprunts
      </li>
    ))}
  </ul>
          </div>
          <div className="card shadow p-3">
          <h5>Retours de livres</h5>
<FaCalendarAlt className="icon" />
<p>{countCurrentMonth} retours ce mois-ci</p>

          </div>
          <div className="card shadow p-3">
            <h5>Durée Moyenne des Retards</h5>
            <p>{calculateAverageLateDuration} jours</p>
         
        </div>
        </div>

        
        {/* Chart section */}
        <div className="charts mt-5">
          <h5 className="mb-4">Graphique des Livres Empruntés vs Retournés</h5>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
