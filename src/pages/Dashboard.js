import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaCalendarAlt, FaBook } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';
import { getToken } from '../services/authService'; 
import { getAllEmprunts, updateStatut, fetchStatistiquesLivres } from '../services/empruntService';
import { fetchTopDocuments ,fetchStatsByYear  } from '../services/documentService';
import { fetchAllPenalites } from '../services/penaliteService';
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
  const [documentStats, setDocumentStats] = useState({}); // State to store document statistics
  
  const [livresEmpruntesCount, setLivresEmpruntesCount] = useState(0); // Books borrowed this month
  const [empruntsEnCours, setEmpruntsEnCours] = useState([]); // Current loans
  const [topDocuments, setTopDocuments] = useState([]); // State to store top documents
  const [availableBooks, setAvailableBooks] = useState(0); // Track the available books
  const [countCurrentMonth, setCountCurrentMonth] = useState(0); // Track the count of returns this month
  const [stats, setStats] = useState({}); // State to store statistics data for the year
  const [averageDureeEmprunt, setAverageDureeEmprunt] = useState(0); // State to store the average duration

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
            console.log('Fetched Stats for the current year:', statsData);
            setStats(statsData);
  
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
            const topDocumentsData = await fetchTopDocuments(); // Fetch top documents
            console.log('Fetched top documents:', topDocumentsData);
            setTopDocuments(topDocumentsData.slice(0, 3)); // Store only the first 3 books
    
            const statistiquesLivres = data[2]; // This should contain { nbDisponibles, nbEmpruntes }
            console.log('Number of available books:', statistiquesLivres.nbDisponibles);
    
            setAvailableBooks(statistiquesLivres.nbDisponibles);
  
            setDocumentStats({
                borrowed: statistiquesLivres.nbEmpruntes,
                available: statistiquesLivres.nbDisponibles,
            });
  
            try {
              const penalites = await fetchAllPenalites(token); // Pass the token to fetchAllPenalites
              console.log('Fetched Penalites:', penalites);
  
              // Count the number of emprunts in the penalites table
              const countEmprunts = penalites.length;
              console.log('Number of Emprunts in Penalite Table:', countEmprunts);
  
              // Calculate the total duration of emprunts
              const totalDureeEmprunt = penalites.reduce((sum, penalite) => sum + (penalite.duree || 0), 0);
              console.log('Total Duration of Emprunts:', totalDureeEmprunt);
  
              // Calculate the average duration
              const average = countEmprunts > 0 ? totalDureeEmprunt / countEmprunts : 0;
              console.log('Average Duration of Emprunts:', average);
  
              // Update the state with the calculated average
              setAverageDureeEmprunt(average.toFixed(2)); // Limit to 2 decimal places
          } catch (error) {
              console.error('Error fetching penalites:', error.message);
          }
        } catch (error) {
            console.error('Error fetching dataaaaaaaaaaaaa:', error.message);
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



 const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Create arrays to store the "empruntés" and "retournés" values
const empruntesData = months.map(month => stats[month]?.empruntés || 0);
const retournesData = months.map(month => stats[month]?.retournés || 0);

// Filter out the months that have no data (optional)
const filteredMonths = months.filter((month, index) => empruntesData[index] !== 0 || retournesData[index] !== 0);
const lineData = {
  labels: months, // Include all months
  datasets: [
    {
      label: 'Livres empruntés',
      data: months.map(month => stats[month]?.empruntés || 0), // Default to 0 if no data
      fill: true,
      backgroundColor: 'rgba(30, 136, 229, 0.2)',
      borderColor: '#1E88E5',
      tension: 0.4,
    },
    {
      label: 'Livres retournés',
      data: months.map(month => stats[month]?.retournés || 0), // Default to 0 if no data
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
            <p>{averageDureeEmprunt} jours</p>
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
