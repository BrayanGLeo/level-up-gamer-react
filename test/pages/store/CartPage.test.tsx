vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});

vi.mock('../../../src/components/RemoveFromCartModal', () => ({
    default: ({ show, onHide, onConfirm, product }: any) => (
        show ? <div>
            <button data-testid="remove-confirm" onClick={() => onConfirm && onConfirm()}>Confirm Remove</button>
            <button data-testid="remove-hide" onClick={() => onHide && onHide()}>Hide</button>
        </div> : null
    )
}));

vi.mock('../../../src/components/ClearCartModal', () => ({
    default: ({ show, onHide, onConfirm }: any) => (
        show ? <div>
            <button data-testid="clear-confirm" onClick={() => onConfirm && onConfirm()}>Confirm Clear</button>
            <button data-testid="clear-hide" onClick={() => onHide && onHide()}>Hide</button>
        </div> : null
    )
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../../../src/pages/store/CartPage';
import * as AuthModule from '../../../src/context/AuthContext';
import * as CartModule from '../../../src/context/CartContext';
import { AuthProvider } from '../../../src/context/AuthContext';
import { CartProvider, CartItem } from '../../../src/context/CartContext';
import { User } from '../../../src/data/userData';

const mockedNavigate = vi.fn();
let mockUseAuth: any;
let mockUseCart: any;

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
            mockUseAuth = vi.spyOn(AuthModule, 'useAuth');
            mockUseCart = vi.spyOn(CartModule, 'useCart');
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

    test('acciones: sumar, restar, abrir modales, vaciar con modales mockeadas', () => {
        const updateQuantity = vi.fn();
        const clearCart = vi.fn();
        const removeFromCart = vi.fn();
        const getCartTotal = vi.fn(() => 200);

        const item = { codigo: 'X1', nombre: 'Prod X', precio: 100, imagen: '', quantity: 2 } as any;

        mockUseCart.mockReturnValue({ cartItems: [item], updateQuantity, clearCart, getCartTotal, removeFromCart });
        mockUseAuth.mockReturnValue({ currentUser: null });

        renderCartPage();

        expect(screen.getByText('Prod X')).toBeInTheDocument();
        const itemPrice = document.querySelector('.carrito-item-precio') as HTMLElement;
        expect(itemPrice).toBeTruthy();
        expect(itemPrice.textContent).toMatch(/200/);

        const totalEl = document.getElementById('total-precio');
        expect(totalEl).toBeTruthy();
        expect(totalEl?.textContent).toMatch(/200/);

        const plus = screen.getByText('+');
        fireEvent.click(plus);
        expect(updateQuantity).toHaveBeenCalledWith('X1', 1);

        const minus = screen.getByText('-');
        fireEvent.click(minus);
        expect(updateQuantity).toHaveBeenCalledWith('X1', -1);

        const removeBtn = screen.getByTitle('Eliminar producto del carrito');
        fireEvent.click(removeBtn);
        const confirmRemove = screen.getByTestId('remove-confirm');
        fireEvent.click(confirmRemove);
        expect(removeFromCart).toHaveBeenCalledWith('X1');

        const vaciar = screen.getByText(/Vaciar Carrito/i);
        fireEvent.click(vaciar);
        const confirmClear = screen.getByTestId('clear-confirm');
        fireEvent.click(confirmClear);
        expect(clearCart).toHaveBeenCalled();

        const finalizar = screen.getByText(/Finalizar Compra/i);
        fireEvent.click(finalizar);
        expect(screen.getByText(/¿Cómo quieres continuar\?/i)).toBeInTheDocument();
    });

    test('reduce quantity to 0 removes the item and shows empty cart (integration-like)', () => {
        mockUseAuth.mockRestore();
        mockUseCart.mockRestore();

        const item = { codigo: 'P1', nombre: 'Prod 1', precio: 50, imagen: '', quantity: 1 } as any;
        localStorage.setItem('carrito', JSON.stringify([item]));

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AuthProvider>
                    <CartProvider>
                        <CartPage />
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Prod 1')).toBeInTheDocument();

        const minus = screen.getByText('-');
        fireEvent.click(minus);

        expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    });

    test('con usuario autenticado, Finalizar Compra navega a /checkout (integration-like)', () => {
        mockUseAuth.mockRestore();
        mockUseCart.mockRestore();

        const item = { codigo: 'P2', nombre: 'Prod 2', precio: 100, imagen: '', quantity: 1 } as any;
        localStorage.setItem('carrito', JSON.stringify([item]));
        localStorage.setItem('currentUser', JSON.stringify({ name: 'A', surname: 'B', email: 'a@b.com' }));

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AuthProvider>
                    <CartProvider>
                        <CartPage />
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        );

        const finalizar = screen.getByText(/Finalizar Compra/i);
        fireEvent.click(finalizar);

        expect(mockedNavigate).toHaveBeenCalledWith('/checkout');
    });

});