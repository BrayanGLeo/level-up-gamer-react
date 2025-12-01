import { vi } from 'vitest';
import { fetchApi, loginApi, registerApi, getPerfilApi, logoutApi, getProductsApi, finalizeCheckoutApi } from '../../src/utils/api';

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de localStorage
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

// Mock de window.location
const assignMock = vi.fn();
const replaceMock = vi.fn();
const mockLocation = {
    ...window.location, // Copiar propiedades existentes como origin, host, etc.
    assign: assignMock,
    replace: replaceMock,
    href: '', // Inicializar href
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true // Hacer que location.href sea escribible
});

describe('api.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        mockLocation.href = ''; // Resetear href en cada test
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
                headers: new Headers({'Content-Length': '100'}), // Añadir para evitar el caso 204
            });

            const result = await fetchApi('/test');
            expect(result).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/test', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
        });

        test('debe manejar errores 401/403: remover currentUser y redirigir a /login', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: () => Promise.resolve({}), // No importa el body para 401/403
                headers: new Headers(),
            });

            localStorageMock.setItem('currentUser', 'some_token'); // Simular que hay un token

            await expect(fetchApi('/test')).rejects.toThrow('Sesión expirada o acceso denegado.');
            expect(localStorageMock.getItem('currentUser')).toBeNull();
            expect(mockLocation.href).toBe('/login');
        });

        test('debe lanzar un error para otras respuestas no-ok', async () => {
            const errorResponseText = 'Not Found';
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                text: () => Promise.resolve(errorResponseText),
                headers: new Headers(),
            });

            await expect(fetchApi('/test')).rejects.toThrow(errorResponseText);
        });

        test('debe lanzar un error con statusText si no hay body en respuesta no-ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: () => Promise.resolve(''), // No hay texto de error
                statusText: 'Internal Server Error',
                headers: new Headers(),
            });

            await expect(fetchApi('/test')).rejects.toThrow('Internal Server Error');
        });

        test('debe retornar un objeto vacío para status 204 (No Content)', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 204,
                headers: new Headers(), // Sin Content-Length
            });

            const result = await fetchApi('/test');
            expect(result).toEqual({});
        });

        test('debe retornar un objeto vacío si Content-Length es 0', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200, // Puede ser cualquier 2xx
                headers: new Headers({'Content-Length': '0'}),
                json: () => Promise.resolve({}), // Aunque json se llame, debería devolver {}
            });

            const result = await fetchApi('/test');
            expect(result).toEqual({});
        });

        test('debe incluir opciones adicionales en la llamada a fetch', async () => {
            const mockData = { data: 'test' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockData),
                headers: new Headers({'Content-Length': '100'}),
            });

            const options = {
                method: 'POST',
                body: JSON.stringify({ key: 'value' }),
                headers: { 'X-Custom-Header': 'custom' },
            };
            await fetchApi('/test-post', options);

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/test-post', {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Custom-Header': 'custom',
                },
                credentials: 'include',
            });
        });
    });

    describe('loginApi', () => {
        test('debe llamar a fetchApi con los datos correctos para el login', async () => {
            const mockAuthResult = { nombre: 'Test User', rol: 'Cliente' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockAuthResult),
                headers: new Headers({'Content-Length': '100'}),
            });

            const email = 'test@example.com';
            const password = 'password123';
            const result = await loginApi(email, password);

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            expect(result).toEqual(mockAuthResult);
        });

        test('debe propagar errores de fetchApi durante el login', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                text: () => Promise.resolve('Invalid credentials'),
                headers: new Headers(),
            });

            await expect(loginApi('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('registerApi', () => {
        test('debe llamar a fetchApi con los datos correctos para el registro', async () => {
            const mockResponse = 'Registro exitoso';
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockResponse),
                headers: new Headers({'Content-Length': '100'}),
            });

            const userData = {
                name: 'Juan',
                surname: 'Perez',
                rut: '12345678-9',
                email: 'juan@example.com',
                password: 'securePassword',
                confirmPassword: 'securePassword'
            };
            const result = await registerApi(userData);

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    nombre: userData.name,
                    apellido: userData.surname,
                    rut: userData.rut,
                    email: userData.email,
                    password: userData.password,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            expect(result).toEqual(mockResponse);
        });

        test('debe propagar errores de fetchApi durante el registro', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                text: () => Promise.resolve('Email already registered'),
                headers: new Headers(),
            });

            const userData = {
                name: 'Juan',
                surname: 'Perez',
                rut: '12345678-9',
                email: 'juan@example.com',
                password: 'securePassword',
                confirmPassword: 'securePassword'
            };
            await expect(registerApi(userData)).rejects.toThrow('Email already registered');
        });
    });

    describe('getPerfilApi', () => {
        test('debe llamar a fetchApi con el método GET para obtener el perfil', async () => {
            const mockApiUser: any = { id: 1, nombre: 'Test', apellido: 'User' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockApiUser),
                headers: new Headers({'Content-Length': '100'}),
            });

            const result = await getPerfilApi();

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/perfil', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            expect(result).toEqual({
                ...mockApiUser,
                name: 'Test',
                surname: 'User',
                registeredAt: expect.any(String),
            });
        });

        test('debe propagar errores de fetchApi al obtener el perfil', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                text: () => Promise.resolve('Perfil no encontrado'),
                headers: new Headers(),
            });

            await expect(getPerfilApi()).rejects.toThrow('Perfil no encontrado');
        });
    });

    describe('logoutApi', () => {
        test('debe llamar a fetchApi con el método POST para cerrar sesión', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ message: 'Logged out' }),
                headers: new Headers({'Content-Length': '100'}),
            });

            const result = await logoutApi();

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            expect(result).toEqual({ message: 'Logged out' });
        });

        test('debe propagar errores de fetchApi al cerrar sesión', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Server error'),
                headers: new Headers(),
            });

            await expect(logoutApi()).rejects.toThrow('Server error');
        });
    });

    describe('getProductsApi', () => {
        test('debe llamar a fetchApi con el método GET para obtener productos', async () => {
            // Esto simula la respuesta cruda de la API
            const mockApiProducts = [{
                codigo: 'P1',
                nombre: 'Product 1',
                precio: 100,
                imagenUrl: '',
                // categoria no está presente, para que el mapeador use 'Sin Categoría'
                descripcion: '',
                stock: 1,
                stockCritico: 1
            }];

            // Esto es lo que esperamos después de que el mapeador procese la respuesta
            const expectedProducts: Product[] = [{
                codigo: 'P1',
                nombre: 'Product 1',
                precio: 100,
                imagen: '',
                categoria: 'Sin Categoría',
                descripcion: '',
                stock: 1,
                stockCritico: 1,
                features: [],
                specifications: {}
            }];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockApiProducts),
                headers: new Headers({ 'Content-Length': '100' }),
            });

            const result = await getProductsApi();

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/tienda/productos', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            expect(result).toEqual(expectedProducts);
        });

        test('debe propagar errores de fetchApi al obtener productos', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Error fetching products'),
                headers: new Headers(),
            });

            await expect(getProductsApi()).rejects.toThrow('Error fetching products');
        });
    });

    describe('finalizeCheckoutApi', () => {
        test('debe llamar a fetchApi con los datos correctos para finalizar la compra', async () => {
            const mockBoletaRequest = { items: [{ productId: 'P1', quantity: 1 }], total: 100 };
            const mockResponse = { message: 'Compra finalizada', orderId: 'ABC' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve(mockResponse),
                headers: new Headers({'Content-Length': '100'}),
            });

            const result = await finalizeCheckoutApi(mockBoletaRequest);

            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/checkout/finalizar', {
                method: 'POST',
                body: JSON.stringify(mockBoletaRequest),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            expect(result).toEqual(mockResponse);
        });

        test('debe propagar errores de fetchApi al finalizar la compra', async () => {
            const mockBoletaRequest = { items: [{ productId: 'P1', quantity: 1 }], total: 100 };
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                text: () => Promise.resolve('Faltan datos de compra'),
                headers: new Headers(),
            });

            await expect(finalizeCheckoutApi(mockBoletaRequest)).rejects.toThrow('Faltan datos de compra');
        });
    });

});
