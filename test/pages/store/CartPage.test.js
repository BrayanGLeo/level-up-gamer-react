import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../../../src/pages/store/CartPage';
import { useAuth } from '../../../src/context/AuthContext';
import { useCart } from '../../../src/context/CartContext';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
    Link: (props) => <a href={props.to} {...props}>{props.children}</a>
}));

jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));
jest.mock('../../context/CartContext', () => ({
    useCart: jest.fn(),
}));

const mockUseAuth = useAuth;
const mockUseCart = useCart;

describe('CartPage', () => {

    beforeEach(() => {
        mockedNavigate.mockClear();
        mockUseAuth.mockClear();
        mockUseCart.mockClear();
    });

    test('debe mostrar el mensaje de carrito vacío si no hay productos', () => {
        mockUseAuth.mockReturnValue({ currentUser: null });
        mockUseCart.mockReturnValue({
            cartItems: [],
            getCartTotal: () => 0,
            getCartItemCount: () => 0,
        });

        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        expect(screen.queryByText(/Total:/i)).not.toBeInTheDocument();
    });

    test('debe mostrar los productos y el total si hay items', () => {
        const mockItems = [
            { codigo: 'P001', nombre: 'Juego de PS5', precio: 49990, quantity: 1, imagen: 'img.jpg' },
            { codigo: 'P002', nombre: 'Control Xbox', precio: 59990, quantity: 2, imagen: 'img.jpg' }
        ];
        mockUseAuth.mockReturnValue({ currentUser: null });
        mockUseCart.mockReturnValue({
            cartItems: mockItems,
            getCartTotal: () => (49990 * 1) + (59990 * 2),
            getCartItemCount: () => 3,
            updateQuantity: jest.fn(),
            removeFromCart: jest.fn(),
            clearCart: jest.fn(),
        });

        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.getByText('Control Xbox')).toBeInTheDocument();
        expect(screen.getByText(/Total:.*169.970/i)).toBeInTheDocument();
        expect(screen.getByText('Vaciar Carrito')).toBeInTheDocument();
        expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
    });

    test('debe mostrar el modal de "Iniciar Sesión" si un invitado finaliza la compra', () => {
        const mockItems = [
            { codigo: 'P001', nombre: 'Juego de PS5', precio: 49990, quantity: 1, imagen: 'img.jpg' }
        ];
        mockUseAuth.mockReturnValue({ currentUser: null });
        mockUseCart.mockReturnValue({
            cartItems: mockItems,
            getCartTotal: () => 49990,
            getCartItemCount: () => 1,
        });

        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Finalizar Compra'));

        expect(screen.getByText('¿Cómo quieres continuar?')).toBeInTheDocument();
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    test('debe navegar a /checkout si un usuario registrado finaliza la compra', () => {
        const mockItems = [
            { codigo: 'P001', nombre: 'Juego de PS5', precio: 49990, quantity: 1, imagen: 'img.jpg' }
        ];
        mockUseAuth.mockReturnValue({ currentUser: { name: 'Test' } });
        mockUseCart.mockReturnValue({
            cartItems: mockItems,
            getCartTotal: () => 49990,
            getCartItemCount: () => 1,
        });

        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Finalizar Compra'));

        expect(screen.queryByText('¿Cómo quieres continuar?')).not.toBeInTheDocument();
        expect(mockedNavigate).toHaveBeenCalledWith('/checkout');
    });

});