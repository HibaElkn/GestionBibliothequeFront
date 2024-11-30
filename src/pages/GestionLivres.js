import React, { useState, useEffect } from 'react';
import livreService from '../services/documentService';

const GestionLivres = () => {
    const [livre, setLivre] = useState({
        titre: '',
        sousTitre: '',
        edition: '',
        cote1: '',
        cote2: '', 
        auteurs: [],
        descripteurs: []
    });

    const [livres, setLivres] = useState([]);
    const [error, setError] = useState(null);  // State for managing errors
    const [isEditMode, setIsEditMode] = useState(false);  // To track if we are in edit mode

    // Fetch all livres and authors on component mount
    useEffect(() => {
        const fetchLivres = async () => {
            try {
                const livresData = await livreService.getAllDocuments(); // Fetching books
                setLivres(livresData);
            } catch (error) {
                console.error("Erreur lors de la récupération des livres:", error);
                setError('Erreur lors de la récupération des livres');  // Display error in UI
            }
        };

        fetchLivres();
    }, []);

    // Handle form submission to add a new livre or update an existing one
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (isEditMode) {
                // Update the book if we are in edit mode
                const updatedLivre = await livreService.updateDocument(livre.id, livre);
                console.log('Livre mis à jour:', updatedLivre);

                // Update the livres state with the updated book
                setLivres(livres.map(l => (l.id === livre.id ? updatedLivre : l)));
                setIsEditMode(false);  // Exit edit mode
            } else {
                // Add a new book if not in edit mode
                const newLivre = await livreService.addLivre(livre);
                console.log('Livre ajouté:', newLivre);
                setLivres([...livres, newLivre]);
            }

            setLivre({
                auteurs: [],
                titre: '',
                sousTitre: '',
                edition: '',
                cote1: '',
                cote2: '',
                descripteurs: []
            });
            setError(null); // Reset error state on successful submission
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setError('Erreur lors de la soumission: ' + error.message); // Show error in UI
        }
    };

    // Handle changes in the input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLivre({ ...livre, [name]: value });
    };

    // Handle changes for list fields (e.g., auteurs and descripteurs)
    const handleListChange = (e, field) => {
        const { value } = e.target;
        setLivre({ ...livre, [field]: value.split(',') });
    };

    // Set the form to edit mode with the selected livre
    const handleEdit = (livreToEdit) => {
        setLivre(livreToEdit);
        setIsEditMode(true);  // Enable edit mode
    };

    // Handle book deletion
    const handleDelete = async (id) => {
        try {
            // Delete the book from the database
            await livreService.deleteDocument(id);

            // Remove the book from the local state (livres)
            setLivres(livres.filter(livre => livre.id !== id));

            // Reset error state on successful deletion
            setError(null);
            console.log(`Livre avec ID ${id} supprimé avec succès.`);
        } catch (error) {
            console.error("Erreur lors de la suppression du livre:", error);
            setError("Erreur lors de la suppression du livre");
        }
    };

    return (
        <div>
            <h1>Gestion des Livres</h1>

            {/* Display error if any */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Form to Add or Edit Livre */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Auteurs (separated by commas):</label>
                    <input 
                        type="text" 
                        name="Auteurs" 
                        value={livre.auteurs.join(", ")} 
                        onChange={(e) => handleListChange(e, 'Auteurs')} 
                    />
                </div>
                <div>
                    <label>Titre:</label>
                    <input 
                        type="text" 
                        name="titre" 
                        value={livre.titre} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Sous-titre:</label>
                    <input 
                        type="text" 
                        name="sousTitre" 
                        value={livre.sousTitre} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Edition:</label>
                    <input 
                        type="text" 
                        name="edition" 
                        value={livre.edition} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Cote 1:</label>
                    <input 
                        type="text" 
                        name="cote1" 
                        value={livre.cote1} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Cote 2:</label>
                    <input 
                        type="text" 
                        name="cote2" 
                        value={livre.cote2} 
                        onChange={handleChange} 
                    />
                </div>

                <div>
                    <label>Descripteurs (separated by commas):</label>
                    <input 
                        type="text" 
                        name="descripteurs" 
                        value={livre.descripteurs.join(", ")} 
                        onChange={(e) => handleListChange(e, 'descripteurs')} 
                    />
                </div>

                <button type="submit">{isEditMode ? 'Mettre à jour Livre' : 'Ajouter Livre'}</button>
            </form>

            {/* Display the list of books */}
            <h2>Liste des Livres</h2>
            <table>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Auteurs</th>
                        <th>Edition</th>
                        <th>Sous-titre</th>
                        <th>Cote 1</th>
                        <th>Cote 2</th>
                        <th>Descripteurs</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {livres.length > 0 ? (
                        livres.map((livre) => (
                            <tr key={livre.id}>
                                <td>{livre.titre}</td>
                                <td>{livre.auteurs.join(", ")}</td>
                                <td>{livre.edition}</td>
                                <td>{livre.sousTitre}</td>
                                <td>{livre.cote1}</td>
                                <td>{livre.cote2}</td>
                                <td>{livre.descripteurs.join(", ")}</td>
                                <td>
                                    <button onClick={() => handleEdit(livre)}>Edit</button>
                                    <button onClick={() => handleDelete(livre.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">Aucun livre trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GestionLivres;