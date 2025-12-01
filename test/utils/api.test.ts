import { vi, describe, beforeEach, test, expect } from 'vitest';
import {
    fetchApi,
    loginApi,
    registerApi,
    getPerfilApi,
    logoutApi,
    getProductsApi,
    getProductByCodeApi,
    finalizeCheckoutApi,
    getBlogPostsApi,
    getBlogPostByIdApi,
    getMyOrdersApi,
    getMyAddressesApi,
    createAddressApi,
    deleteAddressApi,
    updateProfileApi
} from '../../src/utils/api';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const assignMock = vi.fn();
const replaceMock = vi.fn();
const mockLocation = {
    ...window.location,
    assign: assignMock,
    replace: replaceMock,
    href: '',
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
});

describe('api.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        mockLocation.href = '';
    });

    describe('fetchApi', () => {
        test('debe retornar datos si la respuesta es exitosa (200 OK)', async () => {
            const mockData = { message: 'Success' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockData),
                headers: new Headers({ 'Content-Length': '100' }),
            });

            const result = await fetchApi('/test');
            expect(result).toEqual(mockData);
        });

        test('debe retornar objeto vacío si el status es 204 (No Content)', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 204,
                headers: new Headers(),
                json: () => Promise.resolve({}),
            });

            const result = await fetchApi('/test-204');
            expect(result).toEqual({});
        });

        test('debe manejar error 401: remover currentUser', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false, status: 401, json: () => Promise.resolve({}), headers: new Headers(),
            });
            localStorageMock.setItem('currentUser', 'token');
            await expect(fetchApi('/test')).rejects.toThrow('Sesión expirada o acceso denegado.');
            expect(localStorageMock.getItem('currentUser')).toBeNull();
        });

        test('debe manejar error 403: remover currentUser', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false, status: 403, json: () => Promise.resolve({}), headers: new Headers(),
            });
            localStorageMock.setItem('currentUser', 'token');
            await expect(fetchApi('/test')).rejects.toThrow('Sesión expirada o acceso denegado.');
            expect(localStorageMock.getItem('currentUser')).toBeNull();
        });

        test('debe lanzar error genérico para otros fallos (ej. 500)', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false, status: 500, text: () => Promise.resolve('Internal Server Error'), headers: new Headers(),
            });
            await expect(fetchApi('/error')).rejects.toThrow('Internal Server Error');
        });

        test('lanza error con statusText si no hay mensaje de error en el cuerpo', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Error Fatal del Servidor',
                text: () => Promise.resolve(''),
                headers: new Headers(),
            });

            await expect(fetchApi('/error-fatal')).rejects.toThrow('Error Fatal del Servidor');
        });
    });

    describe('Auth Endpoints', () => {
        test('loginApi envía credenciales', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}), headers: new Headers({ 'Content-Length': '10' }) });
            await loginApi('a@b.com', '123');
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.objectContaining({ method: 'POST' }));
        });

        test('registerApi mapea y envía datos correctamente', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve("OK"), headers: new Headers({ 'Content-Length': '10' }) });
            const userData = { name: 'N', surname: 'S', rut: 'R', email: 'E', password: 'P', birthdate: 'B' };

            await registerApi(userData);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/register'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ nombre: 'N', apellido: 'S', rut: 'R', email: 'E', password: 'P' })
                })
            );
        });

        test('logoutApi llama al endpoint de cierre de sesión', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}), headers: new Headers({ 'Content-Length': '10' }) });
            await logoutApi();
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/logout'), expect.objectContaining({ method: 'POST' }));
        });

        test('getPerfilApi obtiene usuario y mapea campos', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true, status: 200,
                json: () => Promise.resolve({ nombre: 'Juan', apellido: 'Perez' }),
                headers: new Headers({ 'Content-Length': '50' })
            });
            const user = await getPerfilApi();
            expect(user.name).toBe('Juan');
            expect(user.surname).toBe('Perez');
        });

        test('updateProfileApi envía datos actualizados', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}), headers: new Headers({ 'Content-Length': '10' }) });
            await updateProfileApi({ name: 'New', surname: 'Name' });
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/perfil'), expect.objectContaining({ method: 'PUT' }));
        });
    });

    describe('Product Endpoints', () => {
        test('getProductsApi mapea imagenUrl y categoria', async () => {
            const rawProduct = { codigo: '1', nombre: 'P1', imagenUrl: 'url', categoria: { nombre: 'Cat' }, precio: 100, stock: 1, stockCritico: 1 };
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve([rawProduct]), headers: new Headers({ 'Content-Length': '100' }) });

            const products = await getProductsApi();
            expect(products[0].imagen).toBe('url');
            expect(products[0].categoria).toBe('Cat');
        });

        test('getProductsApi maneja producto sin imagenUrl (fallback a string vacío)', async () => {
            const rawProductNoImg = { codigo: 'P2', nombre: 'NoImg', categoria: { nombre: 'Cat' }, precio: 10, stock: 1, stockCritico: 1 };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve([rawProductNoImg]),
                headers: new Headers({ 'Content-Length': '100' }),
            });

            const products = await getProductsApi();
            expect(products[0].imagen).toBe('');
        });

        test('getProductByCodeApi obtiene producto individual', async () => {
            const rawProduct = { codigo: '1', nombre: 'P1', imagenUrl: 'url' };
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(rawProduct), headers: new Headers({ 'Content-Length': '50' }) });
            await getProductByCodeApi('1');
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/tienda/productos/1'), expect.anything());
        });
    });

    describe('Blog & User Store Actions', () => {
        test('Blog endpoints', async () => {
            mockFetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]), headers: new Headers({ 'Content-Length': '2' }) });
            await getBlogPostsApi();
            await getBlogPostByIdApi(1);
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        test('Orders & Addresses', async () => {
            mockFetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]), headers: new Headers({ 'Content-Length': '2' }) });
            await getMyOrdersApi();
            await getMyAddressesApi();
            await createAddressApi({});
            await deleteAddressApi(1);
            await finalizeCheckoutApi({});
            expect(mockFetch).toHaveBeenCalledTimes(5);
        });
    });
});