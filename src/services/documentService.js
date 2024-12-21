import { isBibliothecaire, getToken } from "./authService"; // Importer les fonctions du authService

const API_URL = 'http://localhost:8080/documents';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
};

// Fonction pour vérifier l'accès basé sur le rôle "BIBLIOTHECAIRE"
const checkBibliothecaireAccess = () => {
    if (!isBibliothecaire()) {
        throw new Error("Accès refusé : rôle BIBLIOTHECAIRE requis.");
    }
};

const documentService = {
    // Fetch all documents
    getAllDocuments: async () => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'GET',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                }
            });
    
            if (!response.ok) throw new Error('Failed to fetch documents');
    
            const data = await response.json();
    
            // Normalisation des données
            const normalizedData = data.map(doc => ({
                ...doc, // Conserve tous les champs, y compris `img`
                auteur: Array.isArray(doc.auteur) ? doc.auteur : (doc.auteur ? [doc.auteur] : []),
                descripteurs: Array.isArray(doc.descripteurs) ? doc.descripteurs : (doc.descripteurs ? [doc.descripteurs] : []),
                soustitre: doc.sousTitre?.trim() || "Non précisé"
            }));
    
            // Enregistrement dans localStorage
            localStorage.setItem('livres', JSON.stringify(normalizedData));
            return normalizedData;
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    },
    
    getDocumentById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                }
            });
    
            if (!response.ok) throw new Error('Failed to fetch document');
    
            const data = await response.json();
    
            // Normalisation des données
            const normalizedData = {
                ...data,
                // Assurez-vous que 'auteur' est toujours un tableau
                auteur: Array.isArray(data.auteur) ? data.auteur : (data.auteur ? [data.auteur] : []),
                // Vous pouvez également vérifier si les auteurs sont séparés par des virgules et les transformer en tableau
                // Exemple si l'auteur est une chaîne de caractères comme "John, Doe"
                auteur: typeof data.auteur === 'string' ? data.auteur.split(',').map(a => a.trim()) : data.auteur,
                descripteurs: Array.isArray(data.descripteurs) ? data.descripteurs : (data.descripteurs ? [data.descripteurs] : []),
                soustitre: data.sousTitre?.trim() || "Non précisé"
            };
    
            return normalizedData;
        } catch (error) {
            console.error('Error fetching document by ID:', error);
            throw error;
        }
    },
    
  
    
     

    // Save a single document
    saveDocument: async (documentData) => {
        checkBibliothecaireAccess(); // Vérifier l'accès

        try {
            const response = await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(documentData)
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to save document: ${errorResponse}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving document:', error);
            throw error;
        }
    },

    // Save multiple documents
    saveDocuments: async (documentsArray) => {
        checkBibliothecaireAccess(); // Vérifier l'accès

        try {
            const response = await fetch(`${API_URL}/saveAll`, {
                method: 'POST',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(documentsArray)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save documents: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving documents:', error);
            throw error;
        }
    },

    // Change document status
    changeDocumentStatus: async (id, newStatut) => {
        checkBibliothecaireAccess(); // Vérifier l'accès

        try {
            const response = await fetch(`${API_URL}/changeStatus/${id}?newStatut=${newStatut}`, {
                method: 'PUT',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to change document status: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error changing document status:', error);
            throw error;
        }
    },

    // Update a document
    updateDocument: async (id, documentData) => {
        checkBibliothecaireAccess(); // Vérifier l'accès

        try {
            const response = await fetch(`${API_URL}/update/${id}`, {
                method: 'PUT',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(documentData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update document: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    },

    // Delete a document
    deleteDocument: async (id) => {
        checkBibliothecaireAccess(); // Vérifier l'accès

        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete document');
            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },
    deleteDocuments: async (ids) => {
        checkBibliothecaireAccess();
    
        try {
            const response = await fetch(`${API_URL}/delete`, {
                method: 'DELETE',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(ids)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete documents: ${errorText}`);
            }
    
            return true;
        } catch (error) {
            console.error('Error deleting documents:', error);
            throw error;
        }
    },    
    
};

  /*  // Change document status
    updateDocumentAvailability: async (id, newStatut) => {
        checkBibliothecaireAccess(); // Vérifier l'accès

        try {
            const response = await fetch(`${API_URL}/changeStatus/${id}?newStatut=${newStatut}`, {
                method: 'PUT',
                headers: {
                    ...defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to change document status: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error changing document status:', error);
            throw error;
        }
    };
*/
export const fetchTopDocuments = async () => {
    const token = getToken(); // Assuming you have a function to get the token

    if (!token) {
        console.error('Token is missing');
        return []; // Return empty array if no token is available
    }

    try {
        const response = await fetch('http://localhost:8080/api/statistics/documents/top-documents', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Check if response is successful
        if (!response.ok) {
            const text = await response.text();
            console.error(`Error fetching top documents: ${response.status} - ${text}`);
            return []; // Return empty array if the request failed
        }

        // Assuming the response body contains an array of maps (documents)
        const data = await response.json();

        // Validate if data is an array of maps
        if (Array.isArray(data)) {
            // Log only the document titles
            const titles = data.map(item => item.document.titre);
            console.log('Document Titles:', titles);

            // Return titles if needed, otherwise return full data
            return titles; // Or return `data` if you need the full structure
        } else {
            console.error('Invalid data format: Expected an array of documents, received:', data);
            return []; // Return empty array if the data format is invalid
        }
    } catch (error) {
        console.error('Error fetching top documents:', error);
        return []; // Return empty array on network or other errors
    }
};


export const fetchMoyenJoursRetard = async () => {
    const token = getToken(); // Assuming you have a function to get the token
    
    if (!token) {
      console.error('Token is missing');
      return null; // Return null if no token is available
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/emprunts/mpoyen_retard', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Check if response is successful
      if (!response.ok) {
        const text = await response.text();
        console.error(`Error fetching moyen jours retard: ${response.status} - ${text}`);
        return null; // Return null if the request failed
      }
  
      // Parse the response body as a float value
      const data = await response.json();
      return data; // Return the parsed data (a float)
    } catch (error) {
      console.error('Error fetching moyen jours retard:', error);
      return null; // Return null on network or other errors
    }
  };
  
export const fetchStatsByYear = async (year) => {
    try {
      const response = await fetch(`http://localhost:8080/api/statistics/stats/2024`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized access. Please log in again.');
          // Optionally redirect to login page
          // window.location.href = '/login';
        } else {
          throw new Error('Error fetching stats');
        }
      }
      
      const statsData = await response.json();
      console.log('Fetched Stats for the current year:', statsData);
      return statsData;
    } catch (error) {
      console.error('Error fetching stats:', error.message);
      return null;
    }
  };
  
  
export default documentService;
