import React, { useState, useEffect } from 'react';
import TableCRUD from '../components/TableCRUD';
import userService from '../services/userService.js';
import * as XLSX from 'xlsx';

const GestionEtudiants = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the service
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers('etudiant');
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUser = async (newUser) => {
        try {
            const etudiant = {
                nom: newUser.nom,
                prenom: newUser.prenom,
                email: newUser.email,
                codeMassar: newUser.code,
                role: "ETUDIANT"
            };
            await userService.addUser('etudiant', etudiant, "123456");
            const data = await userService.getUsers('etudiant'); // Actualise la liste des étudiants
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        }
    };

    const handleEditUser = async (user) => {
        try {
            const updatedUser = {
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                codeMassar: user.codeMassar, 
                role: "ETUDIANT"
            };
            const updatedData = await userService.updateUser('etudiant', user.id, updatedUser); // Utilisation de l'email pour la mise à jour
            setUsers(prevUsers => 
                prevUsers.map(u => u.email === user.email ? updatedData : u) // Mise à jour de l'utilisateur dans le tableau
            );

            try{
                const data = await userService.getUsers('etudiant'); // Actualise la liste des étudiants
                setUsers(data);
               } catch (error) {
                console.error("Erreur lors de la maj:", error);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await userService.deleteUser('etudiant', id);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id)); // Supprime localement l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };
    
    const handleDeleteSelectedUsers = async (selectedIds) => {
        try {
            await userService.deleteAllUsers('etudiant', selectedIds);
            setUsers(prevUsers => prevUsers.filter(user => !selectedIds.includes(user.id))); // Supprime les utilisateurs sélectionnés
        } catch (error) {
            console.error("Erreur lors de la suppression des utilisateurs sélectionnés :", error);
        }
    };

    const handleImportUsers = async (file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            // Affichez le contenu brut de jsonData pour voir s'il contient bien la colonne codeMassar
            console.log("Contenu de jsonData:", jsonData); 
    
            const utilisateurs = jsonData.map((user) => ({
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                code: user.codeMassar,  // Vérifiez bien que cette clé est correcte
                role: "ETUDIANT"
            }));
    

            const passwords = {};
            utilisateurs.forEach(user => {
                passwords[user.email] = "123456";
            });
    
            try {
                await userService.addAllUsers('etudiant',utilisateurs, passwords); // Utilisation de la méthode générique
                const data = await userService.getUsers('etudiant'); // Actualise la liste des étudiants
                setUsers(data);
            } catch (error) {
                console.error("Erreur lors de l'importation des utilisateurs :", error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <TableCRUD
            data={users}
            firstColumnName="Code Massar"
            firstColumnKey="codeMassar"
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onDeleteSelected={handleDeleteSelectedUsers}
            onImport={handleImportUsers}
        />
    );
};

export default GestionEtudiants;
