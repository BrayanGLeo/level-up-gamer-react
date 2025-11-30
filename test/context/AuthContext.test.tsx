import React, { ReactNode } from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import * as userData from '../../src/data/userData';
import { User } from '../../src/data/userData';

const adminUser: User = { name: 'Admin', surname: 'L-Up', email: 'admin@admin.cl', password: 'admin', role: 'Administrador', rut: '1', emailHistory: [], isOriginalAdmin: true, addresses: [], orders: [] };
const vendedorUser: User = { name: 'Vendedor', surname: 'L-Up', email: 'vendedor@vendedor.cl', password: 'vend', role: 'Vendedor', rut: '2', emailHistory: [], isOriginalAdmin: false, addresses: [], orders: [] };
const clienteUser: User = { name: 'Cliente', surname: 'Test', email: 'cliente@cliente.cl', password: 'cl', role: 'Cliente', rut: '3', emailHistory: [], isOriginalAdmin: false, addresses: [], orders: [] };

vi.mock('../../src/data/userData', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        findUser: vi.fn((email: string) => {
            if (email === adminUser.email) return adminUser;
            if (email === vendedorUser.email) return vendedorUser;
            if (email === clienteUser.email) return clienteUser;
            return undefined;
        }),
        registerUser: vi.fn((data: userData.RegisterData) => {
            if (data.email === 'fail@test.com') {
                throw new Error('Registro fallido');
            }
            return { ...data, role: 'Cliente', rut: '4' } as User;
        }),
    };
});

const AuthProviderWrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;


describe('AuthContext', () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('debe iniciar con currentUser como null', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
        expect(result.current.currentUser).toBeNull();
    });

    test('debe cargar el usuario desde localStorage si existe', () => {
        localStorage.setItem('currentUser', JSON.stringify(clienteUser));
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
        expect(result.current.currentUser?.name).toBe('Cliente');
    });

    test('updateCurrentUser debe actualizar el estado y localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
        
        act(() => {
            result.current.updateCurrentUser(clienteUser);
        });

        expect(result.current.currentUser?.name).toBe('Cliente');
        const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
        expect(stored.name).toBe('Cliente');
    });

    describe('login()', () => {
        test('debe establecer currentUser y devolver redirect a /admin para Administrador', () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult;

            act(() => {
                loginResult = result.current.login(adminUser.email, adminUser.password);
            });

            expect(result.current.currentUser?.role).toBe('Administrador');
            expect(loginResult.success).toBe(true);
            expect(loginResult.redirect).toBe('/admin');
        });

        test('debe devolver redirect a /admin/ordenes para Vendedor', () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult;

            act(() => {
                loginResult = result.current.login(vendedorUser.email, vendedorUser.password);
            });

            expect(result.current.currentUser?.role).toBe('Vendedor');
            expect(loginResult.success).toBe(true);
            expect(loginResult.redirect).toBe('/admin/ordenes');
        });

        test('debe devolver redirect a / para Cliente', () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult;

            act(() => {
                loginResult = result.current.login(clienteUser.email, clienteUser.password);
            });

            expect(result.current.currentUser?.role).toBe('Cliente');
            expect(loginResult.success).toBe(true);
            expect(loginResult.redirect).toBe('/');
        });

        test('debe fallar para credenciales incorrectas', () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            let loginResult;

            act(() => {
                loginResult = result.current.login('wrong@email.com', 'badpass');
            });

            expect(result.current.currentUser).toBeNull();
            expect(loginResult.success).toBe(false);
            expect(loginResult.message).toBe('Correo o contraseña incorrectos.');
        });
    });

    describe('register()', () => {
        test('debe registrar y loguear a un nuevo usuario exitosamente', () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            const newUserData: userData.RegisterData = { email: 'new@test.com', name: 'New', surname: 'User', password: 'p', rut: '5', birthdate: '' };
            let registerResult;
            
            act(() => {
                registerResult = result.current.register(newUserData);
            });

            expect(result.current.currentUser?.email).toBe('new@test.com');
            expect(registerResult.success).toBe(true);
            expect(registerResult.message).toContain('¡Registro Exitoso!');
        });

        test('debe manejar errores cuando registerUser falla', () => {
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            const failedUserData: userData.RegisterData = { email: 'fail@test.com', name: 'Fail', surname: 'User', password: 'p', rut: '6', birthdate: '' };
            let registerResult;

            act(() => {
                registerResult = result.current.register(failedUserData);
            });
            
            expect(result.current.currentUser).toBeNull();
            expect(registerResult.success).toBe(false);
            expect(registerResult.message).toBe('Registro fallido');
        });
    });

    describe('logout()', () => {
        test('debe limpiar currentUser y localStorage', () => {
            localStorage.setItem('currentUser', JSON.stringify(clienteUser));
            const { result } = renderHook(() => useAuth(), { wrapper: AuthProviderWrapper });
            expect(result.current.currentUser).not.toBeNull();

            act(() => {
                result.current.logout();
            });

            expect(result.current.currentUser).toBeNull();
            expect(localStorage.getItem('currentUser')).toBeNull();
        });
    });
});