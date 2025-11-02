import React, { createContext, useState, useContext, useEffect } from 'react';
import { findUser, registerUser } from '../data/userData';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email, password) => {
        const user = findUser(email, password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);

            if (user.role === 'Administrador') {
                alert('Inicio de sesión de administrador exitoso.');
                navigate('/admin');
            } else {
                alert('¡Inicio de Sesión Exitoso!');
                navigate('/');
            }
            return true;
        } else {
            alert('Correo o contraseña incorrectos.');
            return false;
        }
    };

    const register = (userData) => {
        try {
            const newUser = registerUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            setCurrentUser(newUser);

            if (newUser.role === 'Administrador') {
                alert('Cuenta de administrador registrada con éxito.');
                navigate('/admin');
            } else {
                alert('¡Registro Exitoso! Bienvenido.');
                navigate('/');
            }
            return true;
        } catch (error) {
            alert(error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        alert('Has cerrado la sesión.');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);