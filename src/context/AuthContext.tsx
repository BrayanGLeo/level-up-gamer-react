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
    logout: () => LoginResult;
    updateCurrentUser: (user: CurrentUser) => void;
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

    useEffect(() => {
        const checkSession = async () => {
            try {
                const userProfile = await getPerfilApi();
                const user: CurrentUser = { ...userProfile, role: userProfile.role };
                setCurrentUser(user);
            } catch (e) {
                console.error("Sesión de servidor invalidada o no existente.");
                setCurrentUser(null);
            }
        };
        checkSession();
    }, []);

    const updateCurrentUser = (user: CurrentUser) => {
        setCurrentUser(user);
    };

    const login = async (email: string, password: string): Promise<LoginResult> => {
        try {
            const loginResult: AuthApiResult = await loginApi(email, password);
            
            const userProfile = await getPerfilApi();

            const user: CurrentUser = { ...userProfile, role: loginResult.rol };
            
            setCurrentUser(user);

            if (user.role === 'Administrador') {
                return { success: true, redirect: '/admin', message: 'Inicio de sesión de administrador exitoso.' };
            } else if (user.role === 'Vendedor') {
                return { success: true, redirect: '/admin/ordenes', message: 'Inicio de sesión de vendedor exitoso.' };
            } else {
                return { success: true, redirect: '/', message: '¡Inicio de Sesión Exitoso!' };
            }
        } catch (error: any) {
            setCurrentUser(null);
            const message = error.message.includes('Credenciales inválidas') ? 'Correo o contraseña incorrectos.' : error.message;
            return { success: false, message: message };
        }
    };

    const register = async (userData: RegisterData): Promise<LoginResult> => {
        try {
            await registerApi(userData);
            return { success: true, redirect: '/login', message: '¡Registro Exitoso! Inicia sesión para continuar.' };
        } catch (error: any) {
            return { success: false, message: error.message.replace('Error al procesar la solicitud:', '').trim() };
        }
    };

    const logout = (): LoginResult => {
        logoutApi().catch(console.error);
        
        setCurrentUser(null);
        return { success: true, message: 'Has cerrado la sesión.', redirect: '/' };
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, updateCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;