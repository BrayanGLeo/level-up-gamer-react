import { User, RegisterData } from '../data/userData';
import { Product } from '../data/productData';

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

const mapProductFromApi = (apiProduct: any): Product => {
    return {
        codigo: apiProduct.codigo,
        nombre: apiProduct.nombre,
        descripcion: apiProduct.descripcion,
        precio: apiProduct.precio,
        stock: apiProduct.stock,
        stockCritico: apiProduct.stockCritico,
        categoria: apiProduct.categoria ? apiProduct.categoria.nombre : 'Sin Categoría',
        imagen: apiProduct.imagenUrl || '',
        features: [],
        specifications: {}
    };
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
    const apiUser = await fetchApi<any>('/auth/perfil', { method: 'GET' });
    return {
        ...apiUser,
        name: apiUser.nombre,
        surname: apiUser.apellido,
        registeredAt: new Date().toLocaleDateString()
    } as User;
};

export const logoutApi = async (): Promise<any> => {
    return fetchApi<any>('/auth/logout', { method: 'POST' });
};

export const getProductsApi = async (): Promise<Product[]> => {
    const data = await fetchApi<any[]>('/tienda/productos', { method: 'GET' });
    return data.map(mapProductFromApi);
};

export const getProductByCodeApi = async (codigo: string): Promise<Product> => {
    const data = await fetchApi<any>(`/tienda/productos/${codigo}`, { method: 'GET' });
    return mapProductFromApi(data);
};

export const finalizeCheckoutApi = async (boletaRequest: any): Promise<any> => {
    return fetchApi<any>('/checkout/finalizar', {
        method: 'POST',
        body: JSON.stringify(boletaRequest)
    });
};