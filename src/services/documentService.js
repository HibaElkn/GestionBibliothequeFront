const API_URL = 'http://localhost:8080/documents';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
};

const getToken = () => {
    return localStorage.getItem('access-token');
    
};

const documentService = {
// Fetch all documents
getAllDocuments: async () => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                defaultHeaders,
                Authorization: `Bearer ${getToken()}`
            }
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
            // Log the token and data being sent
            console.log('Token:', getToken());
            console.log('Document Data:', documentData);
    
            const response = await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: {
                    ...defaultHeaders, // Correct header structure
                    Authorization: `Bearer ${getToken()}` // Bearer token
                },
                body: JSON.stringify(documentData), // Correct JSON body
            });
    
            if (!response.ok) {
                const errorResponse = await response.text();
                console.error('Error response from backend:', errorResponse);
                throw new Error(`Failed to save document: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Document saved successfully:', data);
            return data;
        } catch (error) {
            console.error('Error saving document:', error.message);
            throw error;
        }
    },
    
    saveDocuments: async (documentsArray) => {
        try {
            // Log documents to be saved
            console.log('Documents Array:', documentsArray);
    
            const response = await fetch(`${API_URL}/saveAll`, {
                method: 'POST',
                headers: {
                    ...defaultHeaders, // Correct header structure
                    Authorization: `Bearer ${getToken()}` // Bearer token
                },
                body: JSON.stringify(documentsArray), // Correct JSON array
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Log backend error response
                console.error('Error from backend:', errorText);
                throw new Error(`Failed to save documents: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Documents saved successfully:', data);
            return data;
        } catch (error) {
            console.error('Error saving documents:', error.message);
            throw error;
        }
    },
       
    // Change document status
    changeDocumentStatus: async (id, newStatut) => {
        try {
            // Log inputs
            console.log('Changing document status for ID:', id, 'to newStatut:', newStatut);
    
            const response = await fetch(`${API_URL}/changeStatus/${id}?newStatut=${newStatut}`, {
                method: 'PUT',
                headers: {
                    ...defaultHeaders, // Correct header structure
                    Authorization: `Bearer ${getToken()}` // Bearer token
                }
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Log backend error response
                console.error('Error from backend:', errorText);
                throw new Error(`Failed to change document status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Document status changed successfully:', data);
            return data;
        } catch (error) {
            console.error('Error changing document status:', error.message);
            throw error;
        }
    },
    

    // Update a document
    updateDocument: async (id, documentData) => {
        try {
            // Log inputs
            console.log('Updating document with ID:', id, 'with data:', documentData);
    
            const response = await fetch(`${API_URL}/update/${id}`, {
                method: 'PUT',
                headers: {
                    ...defaultHeaders, // Correct header structure
                    Authorization: `Bearer ${getToken()}` // Bearer token
                },
                body: JSON.stringify(documentData), // Correct JSON body
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Log backend error response
                console.error('Error from backend:', errorText);
                throw new Error(`Failed to update document: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Document updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating document:', error.message);
            throw error;
        }
    },
    

    // Delete a document
    deleteDocument: async (id) => {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    defaultHeaders,
                    Authorization: `Bearer ${getToken()}`
                },
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
