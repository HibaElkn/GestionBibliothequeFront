// In penaliteService.js
import axios from 'axios';
import {  getToken } from "./authService";

const BASE_URL = 'http://localhost:8080/api/penalites';  // Use port 8080 for backend API
export const savePenalite = async (penaliteData) => {
    console.log("Sending data to Penalite:", penaliteData);
    try {
        const response = await axios.post(BASE_URL, penaliteData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });
        console.log('Penalite saved:', response.data); // Log the saved data
        return response.data;
    } catch (error) {
        console.error('Error saving Penalite:', error.response?.data || error.message);
        throw error; // Throw the error so the caller can handle it
    }
    
};
export const fetchPenalitesByUtilisateur = async (utilisateurId) => {
    const API_URL = `http://localhost:8080/api/penalites/utilisateur/${utilisateurId}`;

    try {
        const token = getToken(); // Assuming you have a function to get the token
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        const responseText = await response.text();
        console.log('Raw Respons:', responseText);

        // Try parsing JSON
        try {
            const penalites = JSON.parse(responseText);
            console.log('Penalites:', penalites);
            return penalites;
        } catch (jsonError) {
            console.error('JSON Parse Error:', jsonError);
            throw new Error('Invalid JSON received from server');
        }
    } catch (error) {
        console.error('Error in fetching penalites:', error);
        throw error;
    }
};
