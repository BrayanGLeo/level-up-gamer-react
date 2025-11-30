import { User, RegisterData } from '../data/userData'; 
import { Product } from '../data/productData';
import { CartItem } from '../context/CartContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// --- UTILIDAD PRINCIPAL PARA TODAS LAS LLAMADAS (CRUCIAL) ---
export const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(API_BASE_URL + url, {
        ...options,
        headers,
        credentials: 'include', // <--- LA CLAVE: Permite enviar y recibir la cookie de sesión.
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('currentUser');
        window.location.href = '/login'; 
        throw new Error('Sesión expirada o acceso denegado.');
    }
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
    }
    
    // Maneja respuestas vacías (DELETE o logout)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T; 
    }
    
    return response.json() as Promise<T>;
};

// --- API: AUTENTICACIÓN Y PERFIL ---

export type AuthApiResult = {
    nombre: string;
    rol: 'Administrador' | 'Vendedor' | 'Cliente';
};

export const loginApi = async (email: string, password: string): Promise<AuthApiResult> => {
    return fetchApi<AuthApiResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
};

export const registerApi = async (userData: RegisterData): Promise<string> => {
    return fetchApi<string>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
};

export const getPerfilApi = async (): Promise<User> => {
    // Usa la cookie de sesión para obtener el objeto Usuario completo y validar la sesión
    return fetchApi<User>('/auth/perfil', { method: 'GET' });
};

export const logoutApi = async (): Promise<any> => {
    return fetchApi<any>('/auth/logout', { method: 'POST' });
};

// --- EJEMPLOS DE OTRAS LLAMADAS ---

export const getProductsApi = async (): Promise<Product[]> => {
    return fetchApi<Product[]>('/tienda/productos', { method: 'GET' });
};

export const finalizeCheckoutApi = async (boletaRequest: any): Promise<any> => {
    return fetchApi<any>('/checkout/finalizar', {
        method: 'POST',
        body: JSON.stringify(boletaRequest)
    });
};

export const getAdminProductsApi = async (): Promise<Product[]> => {
    return fetchApi<Product[]>('/productos', { method: 'GET' });
};