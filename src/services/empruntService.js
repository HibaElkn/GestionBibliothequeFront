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
export async function saveEmprunt(utilisateurId, documentId, emprunt) {
    try {
        // Construct the request body
        const requestBody = {
            dateEmprunt: emprunt.dateEmprunt,
            dateRetour: emprunt.dateRetour,
            document: {
                id: documentId,
                titre: emprunt.documentTitle || 'Untitled Document'
            }
        };

        console.log('Sending Emprunt Request:', requestBody);

        const response = await fetch(`${API_URL}/save?utilisateurId=${utilisateurId}&documentId=${documentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(requestBody),
        });
        console.log('Sending Emprunt Request:', `${API_URL}/emprunts/save?utilisateurId=${utilisateurId}&documentId=${documentId}`);


        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error Details:', errorDetails); // Log detailed error response
            throw new Error(`Erreur lors de la sauvegarde de l'emprunt: ${errorDetails.message || 'Unknown error'}`);
        }

        const responseData = await response.json();
        return responseData;

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
export async function updateEmprunt(id, updatedEmprunt) {
    try {
        // Ensure that 'joursRetard' is not included in the updated data
        const { joursRetard, ...empruntData } = updatedEmprunt; 

        console.log('Updating emprunt with data:', empruntData); // Log the updated data without 'joursRetard'

        const response = await fetch(`${API_URL}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(empruntData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Response error:', errorResponse); // Log the error response body
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
export async function updateStatut(id, statut) {
    try {
        // Prepare the updatedEmprunt object with only the statut
        const updatedEmprunt = {
            statut: statut,  // Only update the statut
        };

        console.log('Sending PUT request to update emprunt with ID:', id);
        console.log('Updated Emprunt data:', updatedEmprunt);

        // Sending PUT request to update the emprunt with the provided ID and updated statut
        const response = await fetch(`http://localhost:8080/api/emprunts/${id}/statut?nouveauStatut=${statut}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,  // Include token for authorization if needed
                'Content-Type': 'application/json',  // Set content type to JSON
            },
            // Send only the statut in the body if needed, otherwise rely on request params
            // body: JSON.stringify(updatedEmprunt),
        });

        if (!response.ok) {
            const errorDetail = await response.text();  // Get detailed error response
            console.error('Error details from server:', errorDetail);
            throw new Error(`Error updating status: ${errorDetail}`);
        }

        const result = await response.json();  // Parse the response to get the result
        console.log('Successfully updated emprunt:', result);
        return result;  // Return the updated emprunt data
    } catch (error) {
        console.error('Error in updateStatut function:', error);
        throw error;  // Throw error if there's an issue with the request
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
export async function getAllEmprunts() {
    const API_URL = 'http://localhost:8080/api/emprunts'; // Your API URL

    try {
        const token = getToken();
        console.log('Using token:', token);
        console.log('Calling API:', API_URL);

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        // Read the raw response as text
        const responseText = await response.text();
      //  console.log('Raw response:', responseText);  // Log raw response for inspection

        if (!response.ok) {
            console.error('Error from API:', responseText);
            throw new Error(`API Error: ${response.status} - ${responseText}`);
        }

        // Try parsing the response as JSON
        try {
            const data = JSON.parse(responseText);
     //       console.log('Parsed data:', data);
            return data;
        } catch (jsonError) {
     //       console.error('JSON parse error:', jsonError);
       //     console.error('Response was:', responseText);
            throw new Error('Failed to parse JSON response');
        }
    } catch (error) {
        console.error('Error in getAllEmprunts:', error);
        throw error;
    }
}
