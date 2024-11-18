import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css'; 
import Login from '../assets/login.jpg';
import { Link, useNavigate } from 'react-router-dom';  // Importez useNavigate

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialisez useNavigate

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "test@example.com" && password === "password123") {
            alert("Connexion réussie!");
            navigate('/home'); // Redirige vers la page principale après une connexion réussie
        } else {
            setError("Identifiants incorrects. Veuillez réessayer.");
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
                    <div className="text-center mt-3">
                        <p>Vous n'avez pas de compte ? <Link to="/sign-up">Sign-up</Link></p>
                    </div>
                </div>
                <div className="login-image">
                    <img src={Login} alt="Login" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
