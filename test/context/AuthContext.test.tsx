import React, { ReactNode } from 'react';
import { render, act, renderHook } from '@testing-library/react';

import { AuthProvider, useAuth, LoginResult } from '../../src/context/AuthContext'; 
import * as userData from '../../src/data/userData';
import * as api from '../../src/utils/api'; 
import { User } from '../../src/data/userData';

const adminUser: User = { name: 'Admin', surname: 'L-Up', email: 'admin@admin.cl', password: 'admin', role: 'Administrador', rut: '1', emailHistory: [], isOriginalAdmin: true, addresses: [], orders: [] };
const vendedorUser: User = { name: 'Vendedor', surname: 'L-Up', email: 'vendedor@vendedor.cl', password: 'vendedor', role: 'Vendedor', rut: '2', emailHistory: [], isOriginalAdmin: false, addresses: [], orders: [] };
const clienteUser: User = { name: 'Cliente', surname: 'Test', email: 'cliente@cliente.cl', password: 'cl', role: 'Cliente', rut: '3', emailHistory: [], isOriginalAdmin: false, addresses: [], orders: [] };

vi.mock('../../src/data/userData', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        findUser: vi.fn(() => undefined),
        registerUser: vi.fn((data: userData.RegisterData) => {
            if (data.email === 'fail@test.com') {
                throw new Error('Registro fallido');
            }
            return { ...data, role: 'Cliente', rut: '4' } as User;
        }),
        addGuestOrder: vi.fn(),
        getGuestOrders: vi.fn(() => []),
    };
});

vi.mock('../../src/utils/api', () => ({
    loginApi: vi.fn(),
    getPerfilApi: vi.fn(() => Promise.reject(new Error('No session'))), // Por defecto, no hay sesión
    registerApi: vi.fn(),
    logoutApi: vi.fn(),
}));

const AuthProviderWrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

const loginApiMock = vi.mocked(api.loginApi);
const getPerfilApiMock = vi.mocked(api.getPerfilApi);
const registerApiMock = vi.mocked(api.registerApi);




describe('AuthContext', () => {
    let consoleErrorSpy: any;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.clear();
        vi.clearAllMocks();
        vi.restoreAllMocks();
        
        loginApiMock.mockClear();
        getPerfilApiMock.mockClear();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        vi.restoreAllMocks();
    });

    test('debe iniciar con currentUser como null', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
        await act(async () => {
            await Promise.resolve(); 
        });
        expect(result.current.currentUser).toBeNull();
    });
    
    test('updateCurrentUser debe actualizar el estado', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
        await act(async () => {
            await Promise.resolve();
        });
        
        act(() => {
            result.current.updateCurrentUser(clienteUser as any);
        });

        expect(result.current.currentUser?.name).toBe('Cliente');
    });

    describe('login()', () => {
        test('debe establecer currentUser y devolver redirect a /admin para Administrador', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult: LoginResult = { success: false, message: '', redirect: '/' }; 
            
            loginApiMock.mockResolvedValue({ nombre: 'Admin L-Up', rol: 'Administrador' } as any);
            getPerfilApiMock.mockResolvedValue(adminUser);

            await act(async () => {
                loginResult = await result.current.login(adminUser.email, 'admin');
            });

            expect(result.current.currentUser?.role).toBe('Administrador');
            expect(loginResult.success).toBe(true);
            expect(loginResult.redirect).toBe('/admin');
        });

        test('debe devolver redirect a /admin/ordenes para Vendedor', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult: LoginResult = { success: false, message: '', redirect: '/' }; 
            
            loginApiMock.mockResolvedValue({ nombre: 'Vendedor L-Up', rol: 'Vendedor' } as any);
            getPerfilApiMock.mockResolvedValue(vendedorUser);

            await act(async () => {
                loginResult = await result.current.login(vendedorUser.email, 'vendedor');
            });

            expect(result.current.currentUser?.role).toBe('Vendedor');
            expect(loginResult.success).toBe(true);
            expect(loginResult.redirect).toBe('/admin/ordenes');
        });

        test('debe devolver redirect a / para Cliente', async () => { 
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult: LoginResult = { success: false, message: '', redirect: '/' }; 
            
            loginApiMock.mockResolvedValue({ nombre: 'Cliente Test', rol: 'Cliente' } as any);
            getPerfilApiMock.mockResolvedValue(clienteUser);

            await act(async () => {
                loginResult = await result.current.login(clienteUser.email, 'cl');
            });

            expect(result.current.currentUser?.role).toBe('Cliente');
            expect(loginResult.success).toBe(true);
            expect(loginResult.redirect).toBe('/');
        });

        test('debe fallar para credenciales incorrectas', async () => { 
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult: LoginResult = { success: false, message: '', redirect: '/' };

            vi.mocked(api.loginApi).mockRejectedValue(new Error('Credenciales inválidas'));

            await act(async () => { 
                loginResult = await result.current.login('wrong@email.com', 'badpass');
            });

            expect(result.current.currentUser).toBeNull();
            expect(loginResult.success).toBe(false);
            expect(loginResult.message).toBe('Correo o contraseña incorrectos.');
        });
    });

    describe('register()', () => {
        test('debe registrar y redirigir a login exitosamente', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            const newUserData: userData.RegisterData = { email: 'new@test.com', name: 'New', surname: 'User', password: 'p', rut: '5', birthdate: '2000-01-01' };
            let registerResult: LoginResult = { success: false, message: '', redirect: '/' };

            registerApiMock.mockResolvedValue('Registro exitoso');

            await act(async () => {
                registerResult = await result.current.register(newUserData);
            });

            expect(registerApiMock).toHaveBeenCalled();
            expect(registerResult.success).toBe(true);
            expect(registerResult.message).toContain('¡Registro Exitoso!');
            expect(registerResult.redirect).toBe('/login');
        });

        test('debe manejar errores cuando register falla (ej. email duplicado)', async () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            const failedUserData: userData.RegisterData = { email: 'fail@test.com', name: 'Fail', surname: 'User', password: 'p', rut: '6', birthdate: '2000-01-01' };
            let registerResult: LoginResult = { success: false, message: '', redirect: '/' };

            registerApiMock.mockRejectedValue(new Error('Error al procesar la solicitud: Correo duplicado'));

            await act(async () => {
                registerResult = await result.current.register(failedUserData);
            });
            
            expect(registerResult.success).toBe(false);
            expect(registerResult.message).toBe('Correo duplicado');
        });
    });
    
    test('debe limpiar currentUser y llamar a logoutApi', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
        await act(async () => {
            await Promise.resolve();
        });
        
        // Mockear un usuario ya logueado para que haya algo que "limpiar"
        act(() => {
            result.current.updateCurrentUser(clienteUser as any);
        });

        vi.mocked(api.logoutApi).mockResolvedValue({});

        await act(async () => { 
            result.current.logout();
        });

        expect(vi.mocked(api.logoutApi)).toHaveBeenCalled();
        expect(result.current.currentUser).toBeNull();
    });
});