import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaCalendarAlt, FaBook } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';
import { getToken } from '../services/authService'; 
import { getAllEmprunts, updateStatut, fetchStatistiquesLivres } from '../services/empruntService';
import { fetchTopDocuments ,fetchStatsByYear  } from '../services/documentService';

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
  const [topDocuments, setTopDocuments] = useState([]); // State to store top documents
  const [availableBooks, setAvailableBooks] = useState(0); // Track the available books
  const [countCurrentMonth, setCountCurrentMonth] = useState(0); // Track the count of returns this month
  const [stats, setStats] = useState({}); // State to store statistics data for the year

  useEffect(() => {
    const token = getToken(); // Assuming getToken() retrieves the authentication token
  
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const fetchData = async () => {
      try {
        // Fetch emprunts data
        const emprunts = await getAllEmprunts();
        const empruntsRetourner = emprunts.filter((emprunt) => emprunt.statut === 'RETOURNER');
    
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        const countCurrentMonth = empruntsRetourner.filter((emprunt) => {
          const dateEmprunt = new Date(emprunt.dateEmprunt);
          return dateEmprunt.getMonth() === currentMonth && dateEmprunt.getFullYear() === currentYear;
        }).length;
    
        setCountCurrentMonth(countCurrentMonth);
    
        const empruntsEnAttente = emprunts.filter((emprunt) => emprunt.statut === 'ATTENTE');
        setEmpruntsEnCours(empruntsEnAttente);
        // Fetch the stats for the current year
        const statsData = await fetchStatsByYear(currentYear); // Fetch stats by year
      console.log('Fetched Stats for the current year:', statsData); // Log stats to the console
      setStats(statsData); // Store the stats in the state

  
        // Fetch data from APIs
        const endpoints = [
          'http://localhost:8080/api/emprunts/count-this-month',
          'http://localhost:8080/api/emprunts/emprunts/en-cours',
          'http://localhost:8080/api/statistics/documents/documents_disponible',
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
        console.log('Fetching top documents...');
        const topDocumentsData = await fetchTopDocuments(); // This fetches top documents
        console.log('Fetched top documents:', topDocumentsData);  // Log fetched data
        setTopDocuments(topDocumentsData.slice(0, 3)); // Store only the first 3 books

        const statistiquesLivres = data[2]; // This should contain { nbDisponibles, nbEmpruntes }
        console.log('Number of available books:', statistiquesLivres.nbDisponibles);
    
        // Set available books count in state
        setAvailableBooks(statistiquesLivres.nbDisponibles);
  
        // Set document stats
        setDocumentStats({
          borrowed: statistiquesLivres.nbEmpruntes,
          available: statistiquesLivres.nbDisponibles,
        });
  
        // Add console log here to check if the API call is working
       
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  }, []); // Only fetch once when component mounts
  
  const doughnutData = {
    labels: ['Livres empruntés', 'Livres disponibles'],
    datasets: [
      {
        data: [
          empruntsEnCours.filter((emprunt) => ['ATTENTE', 'RETARD'].includes(emprunt.statut)).length,  // Borrowed books
          availableBooks,  // Available books
        ],
        backgroundColor: ['#FFA726', '#FFF3E0'],
        hoverBackgroundColor: ['#FF9800', '#FFE0B2'],
      }
    ],
  };

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

 const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Create arrays to store the "empruntés" and "retournés" values
const empruntesData = months.map(month => stats[month]?.empruntés || 0);
const retournesData = months.map(month => stats[month]?.retournés || 0);

// Filter out the months that have no data (optional)
const filteredMonths = months.filter((month, index) => empruntesData[index] !== 0 || retournesData[index] !== 0);

// Update lineData to reflect the dynamic values
const lineData = {
  labels: filteredMonths,
  datasets: [
    {
      label: 'Livres empruntés',
      data: empruntesData.filter((_, index) => filteredMonths.includes(months[index])),
      fill: true,
      backgroundColor: 'rgba(30, 136, 229, 0.2)',
      borderColor: '#1E88E5',
      tension: 0.4,
    },
    {
      label: 'Livres retournés',
      data: retournesData.filter((_, index) => filteredMonths.includes(months[index])),
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
    {topDocuments.length > 0 ? (
      topDocuments.map((titre, index) => (
        <li key={index}>
          {titre}   </li>
      ))
    ) : (
      <li>No top documents available</li>
    )}
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
        <div className="line-chart mt-4">
          <h5>Emprunts et Retours par Mois</h5>
          <Line data={lineData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
