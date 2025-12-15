import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, RegisterData } from '../data/userData';
import { loginApi, registerApi, getPerfilApi, logoutApi, AuthApiResult } from '../utils/api';

export interface CurrentUser extends User {
    role: 'Administrador' | 'Vendedor' | 'Cliente';
}

export interface AuthContextType {
    currentUser: CurrentUser | null;
    login: (email: string, password: string) => Promise<LoginResult>;
    register: (userData: RegisterData) => Promise<LoginResult>;
    logout: () => void;
    updateCurrentUser: (user: CurrentUser) => void;
    isLoading: boolean;
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
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkSession = async () => {
            const userIntentionalLogout = localStorage.getItem('user_logged_out');
            
            if (userIntentionalLogout === 'true') {
                setCurrentUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const userProfile = await getPerfilApi();
                const user: CurrentUser = { ...userProfile, role: userProfile.role };
                setCurrentUser(user);
            } catch (e) {
                console.error("Sesión no válida o expirada.");
                setCurrentUser(null);
                localStorage.removeItem('user_logged_out'); 
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const updateCurrentUser = (user: CurrentUser) => {
        setCurrentUser(user);
    };

    const login = async (email: string, password: string): Promise<LoginResult> => {
        try {
            localStorage.removeItem('user_logged_out'); 

            const loginResult: AuthApiResult = await loginApi(email, password);
            const userProfile = await getPerfilApi();
            const user: CurrentUser = { ...userProfile, role: loginResult.rol };

            setCurrentUser(user);

            if (user.role === 'Administrador') {
                return { success: true, redirect: '/admin', message: 'Bienvenido Admin.' };
            } else if (user.role === 'Vendedor') {
                return { success: true, redirect: '/admin/ordenes', message: 'Bienvenido Vendedor.' };
            } else {
                return { success: true, redirect: '/', message: '¡Inicio de Sesión Exitoso!' };
            }
        } catch (error: any) {
            setCurrentUser(null);
            const message = error.message.includes('Credenciales inválidas') ? 'Datos incorrectos.' : error.message;
            return { success: false, message: message };
        }
    };

    const register = async (userData: RegisterData): Promise<LoginResult> => {
        try {
            localStorage.removeItem('user_logged_out');
            await registerApi(userData);
            return login(userData.email, userData.password);
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        logoutApi().catch(console.error);

        localStorage.setItem('user_logged_out', 'true');

        setCurrentUser(null);
        window.location.href = '/'; 
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, updateCurrentUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;