import { getToken } from "./authService";

const API_URL = 'http://localhost:8080/api/emprunts';

// Vérifier si le nombre d'emprunts d'un utilisateur est valide
export async function isEmpruntCountValid(utilisateurId) {
    try {
        const response = await fetch(`${API_URL}/utilisateur/${utilisateurId}/is-valid`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la vérification du nombre d\'emprunts');
        }

        return await response.json(); // Retourne true ou false
    } catch (error) {
        console.error('Erreur dans isEmpruntCountValid:', error);
        throw error;
    }
}

// Sauvegarder un emprunt
export async function saveEmprunt(utilisateurId, documentId, emprunt) {
    try {
        const response = await fetch(`${API_URL}/save?utilisateurId=${utilisateurId}&documentId=${documentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(emprunt),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde de l\'emprunt');
        }

        return await response.json(); // Retourne l'emprunt créé
    } catch (error) {
        console.error('Erreur dans saveEmprunt:', error);
        throw error;
    }
}

// Supprimer un emprunt
export async function deleteEmprunt(id) {
    try {
        const response = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'emprunt');
        }

        return await response.json(); // Retourne un message de succès
    } catch (error) {
        console.error('Erreur dans deleteEmprunt:', error);
        throw error;
    }
}

// Mettre à jour un emprunt
export async function updateEmprunt(id, updatedEmprunt) {
    try {
        const response = await fetch(`${API_URL}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(updatedEmprunt),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de l\'emprunt');
        }

        return await response.json(); // Retourne l'emprunt mis à jour
    } catch (error) {
        console.error('Erreur dans updateEmprunt:', error);
        throw error;
    }
}

// Obtenir les emprunts d'un document
export async function getEmpruntsByDocument(documentId) {
    try {
        const response = await fetch(`${API_URL}/by-document/${documentId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts du document');
        }

        return await response.json(); // Retourne la liste des emprunts
    } catch (error) {
        console.error('Erreur dans getEmpruntsByDocument:', error);
        throw error;
    }
}

// Obtenir les emprunts d'un utilisateur
export async function getEmpruntsByUtilisateur(utilisateurId) {
    try {
        const response = await fetch(`${API_URL}/by-utilisateur/${utilisateurId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts de l\'utilisateur');
        }

        return await response.json(); // Retourne la liste des emprunts
    } catch (error) {
        console.error('Erreur dans getEmpruntsByUtilisateur:', error);
        throw error;
    }
}

// Obtenir les emprunts en retard
export async function getEmpruntsRetard() {
    try {
        const response = await fetch(`${API_URL}/retard`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts en retard');
        }

        return await response.json(); // Retourne la liste des emprunts en retard
    } catch (error) {
        console.error('Erreur dans getEmpruntsRetard:', error);
        throw error;
    }
}

// Obtenir les emprunts à retourner
export async function getEmpruntsRetourner() {
    try {
        const response = await fetch(`${API_URL}/retourner`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts à retourner');
        }

        return await response.json(); // Retourne la liste des emprunts à retourner
    } catch (error) {
        console.error('Erreur dans getEmpruntsRetourner:', error);
        throw error;
    }
}

// Obtenir les emprunts à retourner avec retard
export async function getEmpruntsRetournerAvecRetard() {
    try {
        const response = await fetch(`${API_URL}/retourneravecretarder`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts à retourner avec retard');
        }

        return await response.json(); // Retourne la liste des emprunts à retourner avec retard
    } catch (error) {
        console.error('Erreur dans getEmpruntsRetournerAvecRetard:', error);
        throw error;
    }
}

// Obtenir les emprunts à retourner sans retard
export async function getEmpruntsRetournerSansRetard() {
    try {
        const response = await fetch(`${API_URL}/retournersansretarder`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts à retourner sans retard');
        }

        return await response.json(); // Retourne la liste des emprunts à retourner sans retard
    } catch (error) {
        console.error('Erreur dans getEmpruntsRetournerSansRetard:', error);
        throw error;
    }
}

// Mettre à jour le statut d'un emprunt
export async function updateStatut(id, nouveauStatut) {
    try {
        const response = await fetch(`${API_URL}/${id}/statut?nouveauStatut=${nouveauStatut}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du statut de l\'emprunt');
        }

        return await response.json(); // Retourne l'emprunt mis à jour avec le nouveau statut
    } catch (error) {
        console.error('Erreur dans updateStatut:', error);
        throw error;
    }
}

// Obtenir les emprunts par statut
export async function getEmpruntsByStatut(statut) {
    try {
        const response = await fetch(`${API_URL}/statut?statut=${statut}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emprunts par statut');
        }

        return await response.json(); // Retourne la liste des emprunts par statut
    } catch (error) {
        console.error('Erreur dans getEmpruntsByStatut:', error);
        throw error;
    }
}

// Obtenir tous les emprunts
export async function getAllEmprunts() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de tous les emprunts');
        }

        return await response.json(); // Retourne la liste de tous les emprunts
    } catch (error) {
        console.error('Erreur dans getAllEmprunts:', error);
        throw error;
    }
}
