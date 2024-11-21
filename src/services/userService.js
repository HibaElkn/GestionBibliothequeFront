const API_BASE_URL = 'http://localhost:8080/api/utilisateur';

const getToken = () => {
    return localStorage.getItem('access-token');
    
};

// Fonction générique pour récupérer les utilisateurs
const getUsers = async (type) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${type}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error in get${capitalizeFirstLetter(type)}s:`, error);
        return [];
    }
};

// Fonction générique pour ajouter un utilisateur
const addUser = async (type, utilisateur, password) => {
        const response = await fetch(`${API_BASE_URL}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`, // Ajoute le token dans les headers
                'password': password,
            },
            body: JSON.stringify(utilisateur),
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de l'ajout de l'utilisateur ${type}`);
        }

        return await response.json();
   
};


export const addAllUsers = async (type, utilisateurs, passwords) => {
    try {
        const response = await fetch(`${API_BASE_URL}/save/list/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ utilisateurs, passwords }),
        });

        if (!response.ok) throw new Error("Échec de l'importation");
        return response;
    } catch (error) {
        console.error(`Erreur lors de l'ajout du ${type}:`, error);
        throw error;
    }
};

// Fonction générique pour mettre à jour un utilisateur
const updateUser = async (type, id, updatedUserData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour du ${type}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Fonction générique pour supprimer un utilisateur
const deleteUser = async (type, id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression du ${type}:`, error);
    }
};

// Fonction générique pour supprimer tous les utilisateurs
const deleteAllUsers = async (type, ids) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${type}/list`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ ids }),
        });
        if (!response.ok) {
            throw new Error(`Failed to delete ${type}s`);
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression des ${type}s:`, error);
    }
};

// Utilitaires pour capitaliser le nom du type d'utilisateur
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
    getUsers,
    addUser,
    addAllUsers,
    updateUser,
    deleteUser,
    deleteAllUsers,
};
