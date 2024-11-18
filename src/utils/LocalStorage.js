// src/utils/localStorage.js

export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
    localStorage.clear();
};

// Nouvelle fonction pour obtenir tous les livres
export const getLivres = () => {
    return getFromLocalStorage('livres') || [];
};

// Nouvelle fonction pour mettre à jour un livre
export const updateLivre = (updatedLivre) => {
    const livres = getLivres();
    const index = livres.findIndex(livre => livre.id === updatedLivre.id); // Assurez-vous que 'id' est la clé unique
    if (index !== -1) {
        livres[index] = updatedLivre;
        saveToLocalStorage('livres', livres);
    }
};
