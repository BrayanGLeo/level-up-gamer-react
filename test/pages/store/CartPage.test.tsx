vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});
vi.mock('../../../src/context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});
vi.mock('../../../src/context/CartContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useCart: vi.fn(),
    };
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../../../src/pages/store/CartPage';
import { useAuth, AuthProvider } from '../../../src/context/AuthContext';
import { useCart, CartProvider, CartItem } from '../../../src/context/CartContext';
import { User } from '../../../src/data/userData';

const mockedNavigate = vi.fn();
const mockUseAuth = useAuth as vi.Mock;
const mockUseCart = useCart as vi.Mock;

const renderCartPage = () => {
    render(
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <CartProvider>
                    <CartPage />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

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

        renderCartPage();

        expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        expect(screen.queryByText(/Total:/i)).not.toBeInTheDocument();
    });

    test('debe mostrar los productos y el total si hay items', () => {
        const mockItems: CartItem[] = [
            { codigo: 'P001', nombre: 'Juego de PS5', precio: 49990, quantity: 1, imagen: 'img.jpg', categoria: 'juegos', descripcion: '', stock: 1, stockCritico: 1 },
            { codigo: 'P002', nombre: 'Control Xbox', precio: 59990, quantity: 2, imagen: 'img.jpg', categoria: 'accesorios', descripcion: '', stock: 1, stockCritico: 1 }
        ];
        mockUseAuth.mockReturnValue({ currentUser: null });
        mockUseCart.mockReturnValue({
            cartItems: mockItems,
            getCartTotal: () => (49990 * 1) + (59990 * 2),
            getCartItemCount: () => 3,
            updateQuantity: vi.fn(),
            removeFromCart: vi.fn(),
            clearCart: vi.fn(),
        });

        renderCartPage();

        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.getByText('Control Xbox')).toBeInTheDocument();

        expect(screen.getByText(/Total:/i)).toBeInTheDocument();
        expect(screen.getByText(/\$169\.970/i)).toBeInTheDocument(); 

        expect(screen.getByText('Vaciar Carrito')).toBeInTheDocument();
        expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
    });

    test('debe mostrar el modal de "Iniciar Sesión" si un invitado finaliza la compra', () => {
        const mockItems: CartItem[] = [
            { codigo: 'P001', nombre: 'Juego de PS5', precio: 49990, quantity: 1, imagen: 'img.jpg', categoria: 'juegos', descripcion: '', stock: 1, stockCritico: 1 }
        ];
        mockUseAuth.mockReturnValue({ currentUser: null });
        mockUseCart.mockReturnValue({
            cartItems: mockItems,
            getCartTotal: () => 49990,
            getCartItemCount: () => 1,
        });

        renderCartPage();
        fireEvent.click(screen.getByText('Finalizar Compra'));

        expect(screen.getByText('¿Cómo quieres continuar?')).toBeInTheDocument();
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    test('debe navegar a /checkout si un usuario registrado finaliza la compra', () => {
        const mockItems: CartItem[] = [
            { codigo: 'P001', nombre: 'Juego de PS5', precio: 49990, quantity: 1, imagen: 'img.jpg', categoria: 'juegos', descripcion: '', stock: 1, stockCritico: 1 }
        ];
        const user: Partial<User> = { name: 'Test' };
        mockUseAuth.mockReturnValue({ currentUser: user });
        mockUseCart.mockReturnValue({
            cartItems: mockItems,
            getCartTotal: () => 49990,
            getCartItemCount: () => 1,
        });

        renderCartPage();
        fireEvent.click(screen.getByText('Finalizar Compra'));

        expect(screen.queryByText('¿Cómo quieres continuar?')).not.toBeInTheDocument();
        expect(mockedNavigate).toHaveBeenCalledWith('/checkout');
    });

});