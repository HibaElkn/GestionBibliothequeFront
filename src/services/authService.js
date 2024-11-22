import {jwtDecode} from "jwt-decode";

// Récupérer le token depuis le localStorage
export const getToken = () => localStorage.getItem("access-token");

// Décoder le token JWT
const decodeToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        return null;
    }
};

// Vérifier si le scope contient "ADMIN"
export const isAdminScope = () => {
    const decodedToken = decodeToken();
    return decodedToken?.scope?.includes("ADMIN") || false;
};

// Vérifier si le scope contient "BIBLIOTHECAIRE"
export const isBibliothecaire = () => {
    const decodedToken = decodeToken();
    return decodedToken?.scope?.includes("BIBLIOTHECAIRE") || false;
};

// Vérifier si le scope contient "ETUDIANT"
export const isEtudiant = () => {
    const decodedToken = decodeToken();
    return decodedToken?.scope?.includes("ETUDIANT") || false;
};

// Vérifier si le scope contient "PERSONNEL"
export const isPersonnel = () => {
    const decodedToken = decodeToken();
    return decodedToken?.scope?.includes("PERSONNEL") || false;
};
// Récupérer l'email du token
export const getEmailFromToken = () => {
    const decodedToken = decodeToken();
    return decodedToken?.sub || null;  // "sub" est l'email dans le token
};
// Export des fonctions
export default {
    getToken,
    isAdminScope,
    isBibliothecaire,
    isEtudiant,
    isPersonnel,
    getEmailFromToken
};
