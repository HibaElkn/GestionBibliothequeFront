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
            const normalizedData = data.map(doc => {
                const { img, ...restOfDoc } = doc; // Supprime le champ img
                return {
                    ...restOfDoc,
                    auteur: Array.isArray(doc.auteur) ? doc.auteur : (doc.auteur ? [doc.auteur] : []),
                    descripteurs: Array.isArray(doc.descripteurs) ? doc.descripteurs : (doc.descripteurs ? [doc.descripteurs] : []),
                    soustitre: doc.sousTitre?.trim() || "Non précisé"
                };
            });

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

    // Change document status
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


export default documentService;
