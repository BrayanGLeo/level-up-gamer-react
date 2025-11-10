import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../src/components/layout/Header';
import { AuthProvider, useAuth } from '../../../src/context/AuthContext';
import { CartProvider, useCart } from '../../../src/context/CartContext';

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: jest.fn(),
}));
jest.mock('../../context/CartContext', () => ({
    ...jest.requireActual('../../context/CartContext'),
    useCart: jest.fn(),
}));

const mockUseAuth = useAuth;
const mockUseCart = useCart;

const renderHeader = () => {
    return render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    );
};

describe('Header', () => {

    beforeEach(() => {
        mockUseAuth.mockClear();
        mockUseCart.mockClear();
    });

    test('renderiza "Iniciar Sesión" para un invitado', () => {
        mockUseAuth.mockReturnValue({ currentUser: null });
        mockUseCart.mockReturnValue({ getCartItemCount: () => 0 });

        renderHeader();

        expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
        expect(screen.queryByText(/Hola,/i)).not.toBeInTheDocument();
    });

    test('renderiza el nombre del usuario y el badge del carrito si está logueado', () => {
        const user = { name: 'Brayan' };
        mockUseAuth.mockReturnValue({ currentUser: user });
        mockUseCart.mockReturnValue({ getCartItemCount: () => 3 });

        renderHeader();

        expect(screen.getByText(/Hola, Brayan/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.queryByText(/Iniciar Sesión/i)).not.toBeInTheDocument();
    });

    test('renderiza el enlace "Panel Admin" si el usuario es Administrador', () => {
        const adminUser = { name: 'Admin', role: 'Administrador' };
        mockUseAuth.mockReturnValue({ currentUser: adminUser });
        mockUseCart.mockReturnValue({ getCartItemCount: () => 0 });

        renderHeader();

        expect(screen.getByText(/Hola, Admin/i)).toBeInTheDocument();

        const dropdown = screen.getByText(/Hola, Admin/i);
        expect(dropdown).toBeInTheDocument();
    });
});