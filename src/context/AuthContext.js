import React, { createContext, useState, useContext, useEffect } from 'react';
import { findUser, registerUser } from '../data/userData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const updateCurrentUser = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    };

    const login = (email, password) => {
        const user = findUser(email, password);
        if (user) {
            updateCurrentUser(user);
            
            if (user.role === 'Administrador') {
                return { success: true, redirect: '/admin', message: 'Inicio de sesión de administrador exitoso.' };
            } else {
                return { success: true, redirect: '/', message: '¡Inicio de Sesión Exitoso!' };
            }
        } else {
            return { success: false, message: 'Correo o contraseña incorrectos.' };
        }
    };

    const register = (userData) => {
        try {
            const newUser = registerUser(userData);
            updateCurrentUser(newUser);

            if (newUser.role === 'Administrador') {
                return { success: true, redirect: '/admin', message: 'Cuenta de administrador registrada con éxito.' };
            } else {
                return { success: true, redirect: '/', message: '¡Registro Exitoso! Bienvenido.' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        return { success: true, message: 'Has cerrado la sesión.', redirect: '/' };
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, updateCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);