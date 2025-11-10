import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { findUser, registerUser, User, RegisterData, Order, Address } from '../data/userData';

export interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => LoginResult;
    register: (userData: RegisterData) => LoginResult;
    logout: () => LoginResult;
    updateCurrentUser: (user: User) => void;
}

export interface LoginResult {
    success: boolean;
    redirect?: string;
    message: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser) as User);
        }
    }, []);

    const updateCurrentUser = (user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    };

    const login = (email: string, password: string): LoginResult => {
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

    const register = (userData: RegisterData): LoginResult => {
        try {
            const newUser = registerUser(userData);
            updateCurrentUser(newUser);

            if (newUser.role === 'Administrador') {
                return { success: true, redirect: '/admin', message: 'Cuenta de administrador registrada con éxito.' };
            } else {
                return { success: true, redirect: '/', message: '¡Registro Exitoso! Bienvenido.' };
            }
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const logout = (): LoginResult => {
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