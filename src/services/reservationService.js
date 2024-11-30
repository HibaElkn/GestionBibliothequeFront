import { getToken } from "./authService";

const API_URL = 'http://localhost:8080/api/reservations';

export async function createReservation(reservationData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création de la réservation');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur dans createReservation:', error);
        throw error;
    }
}

/*
export async function getReservationById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la réservation');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getReservationById:', error);
        throw error;
    }
}

*/
export async function getAllReservations() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des réservations');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getAllReservations:', error);
        throw error;
    }
}


export async function updateReservation(id, reservationData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de la réservation');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur dans updateReservation:', error);
        throw error;
    }
}


export async function deleteReservation(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la réservation');
        }
    } catch (error) {
        console.error('Erreur dans deleteReservation:', error);
        throw error;
    }
}