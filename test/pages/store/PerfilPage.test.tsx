import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PerfilPage from '../../../src/pages/store/PerfilPage';
import { useAuth, AuthContextType } from '../../../src/context/AuthContext';
import { User } from '../../../src/data/userData';

vi.mock('../../../src/context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

const mockUseAuth = useAuth as vi.Mock;

const renderPerfilPage = () => {
    return render(<PerfilPage />);
};

describe('PerfilPage', () => {

    test('renderiza la información del usuario logueado', () => {
        const user: Partial<User> = {
            name: 'Brayan',
            surname: 'Godoy',
            email: 'brayan@gmail.com',
            registeredAt: '10-05-2024'
        };
        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: vi.fn() } as Partial<AuthContextType>);

        renderPerfilPage();

        expect(screen.getByText('Brayan Godoy')).toBeInTheDocument();
        expect(screen.getByText('brayan@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('10-05-2024')).toBeInTheDocument();
    });

    test('renderiza "Fecha no registrada" si el usuario no tiene la propiedad', () => {
        const oldUser: Partial<User> = {
            name: 'Admin',
            surname: 'Test',
            email: 'admin@admin.cl'
        };
        mockUseAuth.mockReturnValue({ currentUser: oldUser, updateCurrentUser: vi.fn() } as Partial<AuthContextType>);

        renderPerfilPage();

        expect(screen.getByText('Admin Test')).toBeInTheDocument();
        expect(screen.getByText('admin@admin.cl')).toBeInTheDocument();
        expect(screen.getByText('Fecha no registrada')).toBeInTheDocument();
    });
});