import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Emprunts.css';
import { getEmpruntsByUtilisateur } from '../services/empruntService';
import authService from '../services/authService';
import userService from '../services/userService';

const MesEmprunts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [empruntsData, setEmpruntsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Charger les données utilisateur pour récupérer l'ID
    const loadUserData = async () => {
        try {
            const emailFromToken = authService.getEmailFromToken();
            const user = await userService.getUserByEmail(emailFromToken);
            setUserId(user.id);
        } catch (err) {
            setError("Impossible de récupérer les informations utilisateur.");
            console.error(err);
        }
    };

    // Charger les emprunts de l'utilisateur connecté
    useEffect(() => {
        const fetchEmprunts = async () => {
            if (!userId) return;
            setLoading(true);
            setError(null);
            try {
                const emprunts = await getEmpruntsByUtilisateur(userId);

                // Ajouter la date prévue de retour (date d'emprunt + 3 jours)
                const empruntsWithDates = emprunts.map((emprunt) => {
                    const dateEmprunt = new Date(emprunt.dateEmprunt);
                    const dateRetourPrevue = new Date(dateEmprunt);
                    dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 3); // Ajout de 3 jours
                    return {
                        ...emprunt,
                        dateRetourPrevue: dateRetourPrevue.toLocaleDateString(), // Formater la date
                    };
                });

                setEmpruntsData(empruntsWithDates);
            } catch (err) {
                setError('Erreur lors du chargement des emprunts. Veuillez réessayer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmprunts();
    }, [userId]);

    // Charger les données utilisateur au premier rendu
    useEffect(() => {
        loadUserData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = empruntsData
    .filter((emprunt) => emprunt.statut !== 'RETOURNER') // Exclure les statuts "RETOURNER"
    .slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(
    empruntsData.filter((emprunt) => emprunt.statut !== 'RETOURNER').length / itemsPerPage
);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatutClass = (statut) => {
        let statutText = '';
        let className = '';

        switch (statut) {
            case 'RETOURNER':
                statutText = 'Retourné';
                className = 'bg-success text-white';
                break;
            case 'ATTENTE':
                statutText = 'En cours';
                className = 'bg-warning text-white';
                break;
            case 'RETARD':
                statutText = 'En retard';
                className = 'bg-danger text-white';
                break;
            default:
                statutText = 'Statut inconnu';
                className = 'bg-secondary text-white';
        }

        return { statutText, className };
    };

    if (loading) {
        return <div className="text-center">Chargement des emprunts...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <div className="table-wrapper">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Titre du Document</th>
                            <th>Date d'emprunt</th>
                            <th>Date prévue de retour</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((emprunt) => (
                            <tr key={emprunt.id}>
                                <td>{emprunt.document.titre || "Titre non disponible"}</td>
                                <td>{new Date(emprunt.dateEmprunt).toLocaleDateString()}</td>
                                <td>{emprunt.dateRetourPrevue}</td>
                                <td>
                                    <span className={`badge ${getStatutClass(emprunt.statut).className} rounded-3`}>
                                        {getStatutClass(emprunt.statut).statutText}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination justify-content-end mt-3">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                Précédent
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                Suivant
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MesEmprunts;
