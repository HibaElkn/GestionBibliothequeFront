import React, { useState, useEffect } from 'react';
import TableCRUD from '../components/TableCRUD';
import userService from '../services/userService.js';
import * as XLSX from 'xlsx';

const GestionBibliothecaires = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the service
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers('bibliothecaire'); // Utilisation de la fonction générique pour récupérer les bibliothécaires
                setUsers(data);
            } catch (error) {
                console.error("Error fetching bibliothécaires:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUser = async (newUser) => {
        try {
            const bibliothecaire = {
                nom: newUser.nom,
                prenom: newUser.prenom,
                email: newUser.email,
                code: newUser.code, // Utilisation du 'Numéro de SOM'
                //role: "BIBLIOTHECAIRE"
            };
            await userService.addUser('bibliothecaire', bibliothecaire, "123456"); // Ajout d'un bibliothécaire
            const data = await userService.getUsers('bibliothecaire'); // Récupère la liste mise à jour
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de l'ajout du bibliothécaire :", error);
        }
    };

    const handleEditUser = async (user) => {
        try {
            const updatedUser = {
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                code: user.code, // 'Numéro de SOM'
                role: user.role
            };
            const updatedData = await userService.updateUser(user.id, updatedUser); // Mise à jour basée sur l'email
            setUsers(prevUsers => 
                prevUsers.map(u => u.email === user.email ? updatedData : u) // Mettre à jour l'utilisateur dans la liste
            );
            try{
                const data = await userService.getUsers('bibliothecaire'); // Actualise la liste des étudiants
                setUsers(data);
               } catch (error) {
                console.error("Erreur lors de la maj:", error);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du bibliothécaire :", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await userService.deleteUser('bibliothecaire', id); // Suppression d'un bibliothécaire
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id)); // Suppression localement dans la liste
        } catch (error) {
            console.error("Erreur lors de la suppression du bibliothécaire :", error);
        }
    };

    const handleDeleteSelectedUsers = async (selectedIds) => {
        try {
            await userService.deleteAllUsers('bibliothecaire', selectedIds); // Suppression des bibliothécaires sélectionnés
            setUsers(prevUsers => prevUsers.filter(user => !selectedIds.includes(user.id))); // Suppression dans la liste locale
        } catch (error) {
            console.error("Erreur lors de la suppression des bibliothécaires sélectionnés :", error);
        }
    };

    const handleImportUsers = async (file) => {
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    
                // Prepare `utilisateurs` and `passwords` objects
                const utilisateurs = jsonData.map((user) => ({
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    code: user.code,
                    role: "BIBLIOTHECAIRE"
                }));
    
                const passwords = {};
                utilisateurs.forEach(user => {
                    passwords[user.email] = "123456";
                });
                console.log("Utilisateurs111:", utilisateurs);
                console.log("Passwords:", passwords);
                
    
                // Call the service function
                const response = await userService.addAllUsers('bibliothecaire', utilisateurs, passwords);
               try{
                const data = await userService.getUsers('bibliothecaire'); // Actualise la liste des étudiants
                setUsers(data);
               } catch (error) {
                console.error("Erreur lors de la maj:", error);
            }
    
                if (response.ok) {
                    console.log("Importation réussie");
                    // Optionally trigger a refresh or any other UI update here
                } else {
                    console.error("Échec de l'importation");
                }
            } catch (error) {
                console.error("Erreur lors de la lecture du fichier ou de l'importation:", error);
            }
        };
    
        reader.readAsArrayBuffer(file);
    };
    


    return (
        <TableCRUD
            data={users}
            firstColumnName="Numéro de SOM"
            firstColumnKey="code" // Le 'Numéro de SOM' dans le tableau
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onDeleteSelected={handleDeleteSelectedUsers}
            onImport={handleImportUsers}
        />
    );
};

export default GestionBibliothecaires;
