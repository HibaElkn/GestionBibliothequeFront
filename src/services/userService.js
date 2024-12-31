import { isAdminScope, getToken } from "./authService";

const API_BASE_URL = 'http://localhost:8080/api/utilisateur';

// Fonction générique pour récupérer les utilisateurs
export const getUsers = async (type) => {
    if (!isAdminScope()) {
        console.error("Accès refusé : Seul un administrateur peut récupérer les utilisateurs.");
        return [];
    }
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
export const addUser = async (type, utilisateur, password) => {
    if (!isAdminScope()) {
        throw new Error("Accès refusé : Seul un administrateur peut ajouter des utilisateurs.");
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
                'password': password,
            },
            body: JSON.stringify(utilisateur),
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de l'ajout de l'utilisateur ${type}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Fonction pour importer plusieurs utilisateurs
export const addAllUsers = async (type, utilisateurs, passwords) => {
    if (!isAdminScope()) {
        throw new Error("Accès refusé : Seul un administrateur peut importer des utilisateurs.");
    }
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
export const updateUser = async (id, updatedUserData) => {
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour du`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Fonction générique pour supprimer un utilisateur
export const deleteUser = async (type, id) => {
    if (!isAdminScope()) {
        throw new Error("Accès refusé : Seul un administrateur peut supprimer un utilisateur.");
    }
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
export const deleteAllUsers = async (type, ids) => {
    if (!isAdminScope()) {
        throw new Error("Accès refusé : Seul un administrateur peut supprimer des utilisateurs.");
    }
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
// Fonction générique pour récupérer un utilisateur par email
export const getUserByEmail = async (email) => {
    //non seulement pour les admin mais cette partie est pour tous les utilisateur de la bibliotheque la fonction 
    //est pour recuperer les info dans le profil
    try {
        const response = await fetch(`${API_BASE_URL}/email/${email}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user by email');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error in getUserByEmail :`, error);
        return null;
    }
};

// Fonction pour changer le mot de passe d'un utilisateur
export const changeUserPassword = async (id, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/password/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'newPassword': newPassword, // Utilisation du header pour transmettre le nouveau mot de passe
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors du changement du mot de passe.");
        }

        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du mot de passe pour l'utilisateur avec ID ${id}:`, error);
        throw error;
    }
};

// Fonction pour récupérer la photo d'un utilisateur par son ID
export const getPhotoByUserId = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/api/photos/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`, // Ajouter le token
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la photo de l’utilisateur.');
        }

        // Récupérer les octets bruts en tant que Blob
    const blob = await response.blob();
    return blob; // La photo est retournée sous forme de chaîne de caractères
    } catch (error) {
        console.error(`Erreur dans getPhotoByUserId :`, error);
        return null;
    }
};

// Fonction pour enregistrer une photo pour un utilisateur
export const savePhotoToUser = async (userId, file) => {
    const token = getToken(); // Remplacez par votre méthode pour récupérer le token

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`http://localhost:8080/api/photos/users/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajouter le token
            },
            body: formData, // Envoyer le fichier
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return await response.json(); // Vérifiez si une réponse JSON est retournée
    } catch (error) {
        console.error('Erreur dans savePhotoToUser:', error);
        throw new Error('Erreur lors de l’enregistrement de la photo de l’utilisateur.');
    }
};


// Utilitaires pour capitaliser le nom du type d'utilisateur
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
export const getUserById = async (id) => {
    //non seulement pour les admin mais cette partie est pour tous les utilisateur de la bibliotheque la fonction 
    //est pour recuperer les info dans le profil
    try {
        const response = await fetch(`${API_BASE_URL}/id/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user by email');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error in getUserByEmail :`, error);
        return null;
    }
};



export default {
    getUsers,
    addUser,
    addAllUsers,
    updateUser,
    deleteUser,
    deleteAllUsers,
    getUserByEmail,
    changeUserPassword,
    getPhotoByUserId,
    savePhotoToUser,
    getUserById,
};

