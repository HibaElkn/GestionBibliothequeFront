const API_URL = "http://localhost:8080/auth"; // Remplacez par l'URL de votre backend

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        // Encoder le mot de passe en Base64
        const encodedPassword = btoa(password);

        // Stocker le mot de passe encodé dans le local storage
        localStorage.setItem("encodedPassword", encodedPassword);

        return data; // Retourne l'objet contenant le token JWT
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
