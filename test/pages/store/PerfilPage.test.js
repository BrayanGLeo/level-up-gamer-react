import React from 'react';
import { render, screen } from '@testing-library/react';
import PerfilPage from '../../../src/pages/store/PerfilPage';
import { useAuth } from '../../../src/context/AuthContext';

jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockUseAuth = useAuth;

const renderPerfilPage = () => {
    return render(<PerfilPage />);
};

describe('PerfilPage', () => {

    test('renderiza la información del usuario logueado', () => {
        const user = {
            name: 'Brayan',
            surname: 'Godoy',
            email: 'brayan@gmail.com',
            registeredAt: '10-05-2024'
        };
        mockUseAuth.mockReturnValue({ currentUser: user, updateCurrentUser: jest.fn() });

        renderPerfilPage();

        expect(screen.getByText('Brayan Godoy')).toBeInTheDocument();
        expect(screen.getByText('brayan@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('10-05-2024')).toBeInTheDocument();
    });

    test('renderiza "Fecha no registrada" si el usuario no tiene la propiedad', () => {
        const oldUser = {
            name: 'Admin',
            surname: 'Test',
            email: 'admin@admin.cl'
        };
        mockUseAuth.mockReturnValue({ currentUser: oldUser, updateCurrentUser: jest.fn() });

        renderPerfilPage();

        expect(screen.getByText('Admin Test')).toBeInTheDocument();
        expect(screen.getByText('admin@admin.cl')).toBeInTheDocument();
        expect(screen.getByText('Fecha no registrada')).toBeInTheDocument();
    });
});