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

