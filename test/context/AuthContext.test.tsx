import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthProvider, useAuth, AuthContextType } from '../../src/context/AuthContext';
import * as userData from '../../src/data/userData';
import { User } from '../../src/data/userData';

vi.mock('../../src/data/userData', async (importOriginal) => {
    const actual = await importOriginal() as object;
    const adminUser: User = {
        name: 'Admin', surname: 'LevelUp', email: 'admin@admin.cl', password: 'admin',
        role: 'Administrador', rut: '12345678-9', emailHistory: [], isOriginalAdmin: true,
        addresses: [], orders: []
    };
    
    return {
        ...actual,
        findUser: vi.fn((email, password) => {
            if (email === 'admin@admin.cl' && password === 'admin') {
                return adminUser;
            }
            return undefined;
        }),
        registerUser: vi.fn((data: userData.RegisterData) => {
            if (data.email === 'test@gmail.com') {
                return { ...data, role: 'Cliente', rut: '11111111-1' } as User;
            }
            throw new Error('Email duplicado');
        }),
    };
});

const TestComponent = () => {
    const { currentUser, login, logout, register } = useAuth() as AuthContextType;

    return (
        <div>
            <div data-testid="user-name">{currentUser ? currentUser.name : 'Invitado'}</div>
            <button onClick={() => login('admin@admin.cl', 'admin')}>Login Admin</button>
            <button onClick={() => login('error@gmail.com', 'badpass')}>Login Fallido</button>
            <button onClick={() => logout()}>Logout</button>
            <button onClick={() => register({} as userData.RegisterData)}>Register</button>
        </div>
    );
};

const renderWithAuthProvider = () => {
    return render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );
};

describe('AuthContext', () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks(); 
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('debe iniciar con currentUser como null (invitado)', () => {
        renderWithAuthProvider();
        expect(screen.getByTestId('user-name')).toHaveTextContent('Invitado');
    });

    test('debe cargar el usuario desde localStorage si existe', () => {
        const mockUser = { name: 'Usuario Guardado', email: 'guardado@gmail.com' };
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        renderWithAuthProvider();
        expect(screen.getByTestId('user-name')).toHaveTextContent('Usuario Guardado');
    });

    test('login() debe establecer currentUser y guardarlo en localStorage', () => {
        renderWithAuthProvider();
        const loginButton = screen.getByText('Login Admin');

        act(() => {
            loginButton.click();
        });

        expect(screen.getByTestId('user-name')).toHaveTextContent('Admin');
        
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        expect(storedUser.name).toBe('Admin');
    });

    test('login() fallido no debe establecer currentUser', () => {
        renderWithAuthProvider();
        const loginButton = screen.getByText('Login Fallido');

        act(() => {
            loginButton.click();
        });

        expect(screen.getByTestId('user-name')).toHaveTextContent('Invitado');
        expect(localStorage.getItem('currentUser')).toBeNull();
    });

    test('logout() debe limpiar currentUser y localStorage', () => {
        renderWithAuthProvider();
        const loginButton = screen.getByText('Login Admin');
        act(() => { loginButton.click(); });
        expect(screen.getByTestId('user-name')).toHaveTextContent('Admin');

        const logoutButton = screen.getByText('Logout');
        act(() => {
            logoutButton.click();
        });

        expect(screen.getByTestId('user-name')).toHaveTextContent('Invitado');
        expect(localStorage.getItem('currentUser')).toBeNull();
    });

});