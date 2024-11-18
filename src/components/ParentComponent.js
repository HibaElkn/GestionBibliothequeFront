import React, { useState, useEffect } from 'react';
import TableLivres from './TableLivres';
import documentService from '../services/documentService';

const ParentComponent = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Fetch documents initially or through any other logic
        documentService.getAllDocuments().then(setDocuments);
    }, []);

    const deleteDocument = async (id) => {
        try {
            const response = await documentService.deleteDocument(id);  // Call your deleteDocument service
            if (response) {
                // Update the state to remove the deleted document from the UI
                setDocuments((prevDocs) => prevDocs.filter(doc => doc.id !== id));
            }
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleAddBooks = (newBooks) => {
        setDocuments((prevDocs) => [...prevDocs, ...newBooks]);
    };

    return (
        <div>
            <TableLivres
                onDelete={deleteDocument}  // Pass deleteDocument as the onDelete prop
                documents={documents}
                onAddBooks={handleAddBooks}
            />
        </div>
    );
};

export default ParentComponent;
