import { fetchApi } from '../utils/api';
import { Product } from '../data/productData';
import { User } from '../data/userData';
import { Category } from '../data/categoryData';

const serializeProduct = (product: Product, selectedCategory: Category): any => {
    const productToSend: any = {
        ...product,
        categoria: {
            id: selectedCategory.id,
            nombre: selectedCategory.nombre
        },
    };

    if (product.features) {
        productToSend.features = JSON.stringify(product.features.filter(f => f.trim() !== ''));
    }
    if (product.specifications) {
        productToSend.specifications = JSON.stringify(product.specifications);
    }

    return productToSend;
};

export const getAdminProducts = async (): Promise<Product[]> => {
    return fetchApi<Product[]>('/productos', { method: 'GET' });
};

export const getProductByCode = async (codigo: string): Promise<Product> => {
    return fetchApi<Product>(`/productos/${codigo}`, { method: 'GET' });
};

export const createProduct = async (product: Product, category: Category): Promise<Product> => {
    const payload = serializeProduct(product, category);
    return fetchApi<Product>('/productos', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};

export const updateProduct = async (product: Product, category: Category): Promise<Product> => {
    const payload = serializeProduct(product, category);
    return fetchApi<Product>(`/productos/${product.codigo}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
};

export const deleteProduct = async (codigo: string): Promise<void> => {
    return fetchApi<void>(`/productos/${codigo}`, { method: 'DELETE' });
};

export const getCategories = async (): Promise<Category[]> => {
    return fetchApi<Category[]>('/admin/categorias', { method: 'GET' });
};

export const createCategory = async (nombre: string): Promise<Category> => {
    return fetchApi<Category>('/admin/categorias', {
        method: 'POST',
        body: JSON.stringify({ nombre })
    });
};

export const updateCategory = async (id: number, nombre: string): Promise<Category> => {
    return fetchApi<Category>(`/admin/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ id, nombre })
    });
};

export const deleteCategory = async (id: number): Promise<void> => {
    return fetchApi<void>(`/admin/categorias/${id}`, { method: 'DELETE' });
};

export const getAdminUsers = async (): Promise<User[]> => {
    return fetchApi<User[]>('/admin/usuarios', { method: 'GET' });
};

export const getUserByRut = async (rut: string): Promise<User> => {
    return fetchApi<User>(`/admin/usuarios/rut/${rut}`, { method: 'GET' });
};

export const createUser = async (user: any): Promise<User> => {
    return fetchApi<User>('/admin/usuarios', {
        method: 'POST',
        body: JSON.stringify(user)
    });
};

export const updateAdminUser = async (user: User): Promise<User> => {
    return fetchApi<User>(`/admin/usuarios/rut/${user.rut}`, {
        method: 'PUT',
        body: JSON.stringify(user)
    });
};

export const deleteUserByRut = async (rut: string): Promise<void> => {
    return fetchApi<void>(`/admin/usuarios/rut/${rut}`, { method: 'DELETE' });
};