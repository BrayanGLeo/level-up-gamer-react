import { User, RegisterData } from '../data/userData'; 
import { Product } from '../data/productData';
import { CartItem } from '../context/CartContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(API_BASE_URL + url, {
        ...options,
        headers,
        credentials: 'include', 
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
    
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T; 
    }
    
    return response.json() as Promise<T>;
};

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
    const apiPayload = {
        nombre: userData.name, 
        apellido: userData.surname,
        rut: userData.rut,
        email: userData.email,
        password: userData.password
    };
    
    return fetchApi<string>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(apiPayload)
    });
};

export const getPerfilApi = async (): Promise<User> => {
    return fetchApi<User>('/auth/perfil', { method: 'GET' });
};

export const logoutApi = async (): Promise<any> => {
    return fetchApi<any>('/auth/logout', { method: 'POST' });
};

export const getProductsApi = async (): Promise<Product[]> => {
    return fetchApi<Product[]>('/tienda/productos', { method: 'GET' });
};

export const finalizeCheckoutApi = async (boletaRequest: any): Promise<any> => {
    return fetchApi<any>('/checkout/finalizar', {
        method: 'POST',
        body: JSON.stringify(boletaRequest)
    });
};

