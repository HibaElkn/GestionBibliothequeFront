import React, { useState, useEffect } from 'react';
import TableCRUD from '../components/TableCRUD';
import userService from '../services/userService.js';
import * as XLSX from 'xlsx';

const GestionAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the service
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers('admin'); // Récupère les utilisateurs administrateurs
                setUsers(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des administrateurs :", error);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUser = async (newUser) => {
        try {
            const admin = {
                nom: newUser.nom,
                prenom: newUser.prenom,
                email: newUser.email,
                code: newUser.code, // Utilisation du 'Numéro de SOM'
                //role: "ADMIN"
            };
            await userService.addUser('admin', admin, "123456"); // Ajout d'un administrateur
            const data = await userService.getUsers('admin'); // Récupère la liste mise à jour des administrateurs
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'administrateur :", error);
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
            const updatedData = await userService.updateUser( user.id, updatedUser); // Mise à jour basée sur l'email
            setUsers(prevUsers => 
                prevUsers.map(u => u.email === user.email ? updatedData : u) // Mettre à jour l'utilisateur dans la liste
            );
            try{
                const data = await userService.getUsers('admin'); // Actualise la liste des étudiants
                setUsers(data);
               } catch (error) {
                console.error("Erreur lors de la maj:", error);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'admin :", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await userService.deleteUser('admin', id); // Suppression d'un administrateur
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id)); // Suppression localement dans la liste
        } catch (error) {
            console.error("Erreur lors de la suppression de l'administrateur :", error);
        }
    };

    const handleDeleteSelectedUsers = async (selectedIds) => {
        try {
            await userService.deleteAllUsers('admin', selectedIds); // Suppression en masse des administrateurs sélectionnés
            setUsers(prevUsers => prevUsers.filter(user => !selectedIds.includes(user.id))); // Suppression dans la liste locale
        } catch (error) {
            console.error("Erreur lors de la suppression des administrateurs sélectionnés :", error);
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
                role: "ADMIN"
            }));

            const passwords = {};
            utilisateurs.forEach(user => {
                passwords[user.email] = "123456";
            });
            console.log("Utilisateurs111:", utilisateurs);
            console.log("Passwords:", passwords);
            

            // Call the service function
            const response = await userService.addAllUsers('admin', utilisateurs, passwords);
           try{
            const data = await userService.getUsers('admin'); // Actualise la liste des étudiants
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
            firstColumnName="Numéro de SOM"  // 'Numéro de SOM' pour les administrateurs
            firstColumnKey="code"  // Utilisation du 'code' comme clé pour le 'Numéro de SOM'
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onDeleteSelected={handleDeleteSelectedUsers}
            onImport={handleImportUsers}
        />
    );
};

export default GestionAdmin;
