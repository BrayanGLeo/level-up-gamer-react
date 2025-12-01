import { vi, describe, beforeEach, test, expect, afterEach } from 'vitest';
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
global.fetch = mockFetch;

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
        assignMock.mockClear();
        replaceMock.mockClear();
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
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/test', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
        });

        test('debe manejar errores 401/403: remover currentUser', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: () => Promise.resolve({}),
                headers: new Headers(),
            });

            localStorageMock.setItem('currentUser', 'some_token');

            await expect(fetchApi('/test')).rejects.toThrow('Sesión expirada o acceso denegado.');
            expect(localStorageMock.getItem('currentUser')).toBeNull();
        });
    });

    describe('Auth Endpoints', () => {
        test('loginApi envía credenciales correctamente', async () => {
            const mockResult = { nombre: 'User', rol: 'Cliente' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockResult),
                headers: new Headers({ 'Content-Length': '50' }),
            });

            await loginApi('test@test.com', '123456');
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/login'),
                expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'test@test.com', password: '123456' }) })
            );
        });

        test('getPerfilApi obtiene y mapea el usuario', async () => {
            const apiUser = { nombre: 'Juan', apellido: 'Perez', email: 'j@p.cl' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(apiUser),
                headers: new Headers({ 'Content-Length': '50' }),
            });

            const result = await getPerfilApi();
            expect(result.name).toBe('Juan');
            expect(result.surname).toBe('Perez');
            expect(result.registeredAt).toBeDefined();
        });

        test('updateProfileApi envía datos PUT correctamente', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({}),
                headers: new Headers({ 'Content-Length': '10' }),
            });

            const updateData = { name: 'NewName', surname: 'NewLast', password: 'newpass' };
            await updateProfileApi(updateData);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/perfil'),
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify({ nombre: 'NewName', apellido: 'NewLast', password: 'newpass' })
                })
            );
        });
    });

    describe('Product Endpoints (con Mapeo)', () => {
        const backendProduct = {
            codigo: 'P1',
            nombre: 'Prod Backend',
            precio: 100,
            stock: 5,
            stockCritico: 2,
            imagenUrl: 'http://img.com/1.jpg',
            categoria: { id: 1, nombre: 'Juegos' },
            descripcion: 'Desc'
        };

        test('getProductsApi obtiene lista y mapea correctamente', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve([backendProduct]),
                headers: new Headers({ 'Content-Length': '100' }),
            });

            const result = await getProductsApi();

            expect(result).toHaveLength(1);
            expect(result[0].nombre).toBe('Prod Backend');
            expect(result[0].imagen).toBe('http://img.com/1.jpg');
            expect(result[0].categoria).toBe('Juegos');
            expect(result[0].features).toEqual([]);
        });

        test('getProductByCodeApi obtiene un producto y lo mapea', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(backendProduct),
                headers: new Headers({ 'Content-Length': '100' }),
            });

            const result = await getProductByCodeApi('P1');
            expect(result.codigo).toBe('P1');
            expect(result.imagen).toBe('http://img.com/1.jpg');
        });
    });

    describe('Blog Endpoints', () => {
        test('getBlogPostsApi llama al endpoint correcto', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true, status: 200, json: () => Promise.resolve([]), headers: new Headers({ 'Content-Length': '2' })
            });
            await getBlogPostsApi();
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/blog'), expect.objectContaining({ method: 'GET' }));
        });

        test('getBlogPostByIdApi llama con ID', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true, status: 200, json: () => Promise.resolve({}), headers: new Headers({ 'Content-Length': '2' })
            });
            await getBlogPostByIdApi(99);
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/blog/99'), expect.anything());
        });
    });

    describe('Store User Actions', () => {
        test('getMyOrdersApi', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true, status: 200, json: () => Promise.resolve([]), headers: new Headers({ 'Content-Length': '2' })
            });
            await getMyOrdersApi();
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ordenes/mis-pedidos'), expect.anything());
        });

        test('Direcciones CRUD', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve([]), headers: new Headers({ 'Content-Length': '2' }) });
            await getMyAddressesApi();
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/usuarios/direcciones'), expect.objectContaining({ method: 'GET' }));

            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}), headers: new Headers({ 'Content-Length': '2' }) });
            await createAddressApi({ alias: 'Casa' });
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/usuarios/direcciones'), expect.objectContaining({ method: 'POST' }));

            mockFetch.mockResolvedValueOnce({ ok: true, status: 204, headers: new Headers() });
            await deleteAddressApi(1);
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/usuarios/direcciones/1'), expect.objectContaining({ method: 'DELETE' }));
        });

        test('finalizeCheckoutApi envía la orden', async () => {
            mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }), headers: new Headers({ 'Content-Length': '10' }) });
            const boleta = { total: 1000, items: [] };

            await finalizeCheckoutApi(boleta);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/checkout/finalizar'),
                expect.objectContaining({ method: 'POST', body: JSON.stringify(boleta) })
            );
        });
    });
});