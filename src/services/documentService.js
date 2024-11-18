const API_URL = 'http://localhost:8080/documents';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
};
const documentService = {
// Fetch all documents
getAllDocuments: async () => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: defaultHeaders,
        });

        if (!response.ok) throw new Error('Failed to fetch documents');
        
        const data = await response.json();
        
        // Log the raw data fetched from the API (this is your original JSON)
        console.log('Fetched Data:', JSON.stringify(data, null, 2));

        // Normalize the data to ensure 'auteur', 'descripteurs', and 'soustitre' are handled correctly
        const normalizedData = data.map(doc => {
            const { img, ...restOfDoc } = doc; // Destructure to ignore 'img' field

            return {
                ...restOfDoc,
                auteur: Array.isArray(doc.auteur) ? doc.auteur : (doc.auteur ? [doc.auteur] : []),  // Normalize 'auteur'
                descripteurs: Array.isArray(doc.descripteurs) ? doc.descripteurs : (doc.descripteurs ? [doc.descripteurs] : []),  // Normalize 'descripteurs'
                soustitre: doc.sousTitre && doc.sousTitre.trim() !== "" ? doc.sousTitre : "Non précisé",  // Correctly handle 'soustitre'
            };
        });

        // Log the normalized data after processing
        console.log('Normalized Data:', JSON.stringify(normalizedData, null, 2));

        // Check the size of the data before storing in localStorage
        const livresData = JSON.stringify(normalizedData);
        console.log('Data size:', livresData.length);

        // If the data is too large (greater than the localStorage quota), trim it
        const maxSize = 5 * 1024 * 1024; // Approx 5MB
        if (livresData.length > maxSize) {
            console.warn('Data too large for localStorage. Trimming data...');
            // Store only the first 50 documents (adjust the number as needed)
            const limitedData = normalizedData.slice(0, 50);
            localStorage.setItem('livres', JSON.stringify(limitedData));
        } else {
            // Otherwise, store the entire dataset
            localStorage.setItem('livres', livresData);
        }

        return normalizedData;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
},

    // Save a single document
    saveDocument: async (documentData) => {
        try {
            const response = await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(documentData),
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                console.error('Error response from backend:', errorResponse);
                throw new Error('Failed to save document');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving document:', error);
            throw error;
        }
    },
    saveDocuments: async (documentsArray) => {
        try {
            const response = await fetch(`${API_URL}/saveAll`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(documentsArray),  // Sending the cleaned data to the backend
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Get the error response text
                console.error('Error from backend:', errorText);
                throw new Error('Failed to save documents');
            }
    
            return await response.json();  // Returning the response from the backend
        } catch (error) {
            console.error('Error saving documents:', error);
            throw error;
        }
    },    
    // Change document status
    changeDocumentStatus: async (id, newStatut) => {
        try {
            const response = await fetch(`${API_URL}/changeStatus/${id}?newStatut=${newStatut}`, {
                method: 'PUT',
                headers: defaultHeaders
            });
            if (!response.ok) throw new Error('Failed to change document status');
            return await response.json();
        } catch (error) {
            console.error('Error changing document status:', error);
            throw error;
        }
    },

    // Update a document
    updateDocument: async (id, documentData) => {
        try {
            const response = await fetch(`${API_URL}/update/${id}`, {
                method: 'PUT',
                headers: defaultHeaders,
                body: JSON.stringify(documentData),
            });
            if (!response.ok) throw new Error('Failed to update document');
            return await response.json();
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    },

    // Delete a document
    deleteDocument: async (id) => {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
                headers: defaultHeaders
            });
            if (!response.ok) throw new Error('Failed to delete document');
            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }
};

export default documentService;
