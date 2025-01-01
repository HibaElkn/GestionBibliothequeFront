// In penaliteService.js
import axios from 'axios';
import {  getToken } from "./authService";
import API_BASE_URL from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/api/penalites`;  // Use port 8080 for backend API

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
    const API_URL = `${API_BASE_URL}/api/penalites/utilisateur/${utilisateurId}`;

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
export const fetchAllPenalites = async (token) => {
    const API_URL = `${API_BASE_URL}/api/penalites`; // Replace with your actual backend URL

    try {
        const token = getToken(); // Assuming you have a function to get the token
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });


        // Handle response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const penalites = await response.json(); // Parse JSON response
        console.log('Fetched Penalites:', penalites); // Display fetched data in the console
        return penalites;
    } catch (error) {
        console.error('Error fetching penalites:', error.message); // Log detailed error information
        throw error;
    }
};
