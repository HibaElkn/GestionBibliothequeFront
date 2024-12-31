import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';
import Login from '../assets/login.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/loginService'; // Importation du service
import authService from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            // Stocker le token dans le localStorage
            localStorage.setItem('access-token', data['access-token']);
            console.log(localStorage.setItem('access-token', data['access-token']));
            
            if (authService.isAdminScope() || authService.isBibliothecaire()) {
                // Si l'utilisateur est admin ou bibliothécaire, rediriger vers le tableau de bord
                navigate('/dashboard');
            } else if (authService.isEtudiant() || authService.isPersonnel()) {
                // Si l'utilisateur est étudiant ou personnel, rediriger vers le catalogue
                navigate('/user-interface');
            } else {
                setError("Rôle inconnu, veuillez contacter l'administrateur.");
            }
           



        } catch (error) {
            setError("Identifiants incorrects ou erreur de connexion. Veuillez réessayer.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-form">
                    <h2 className="text-center">Login</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group text-right">
                            <Link to="/forgot-password">Forgot your password?</Link>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>
                    {/*
<div className="text-center mt-3">
    <p>Vous n'avez pas de compte ? <Link to="/sign-up">Sign-up</Link></p>
</div>
*/}

                </div>
                <div className="login-image">
                    <img src={Login} alt="Login" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
