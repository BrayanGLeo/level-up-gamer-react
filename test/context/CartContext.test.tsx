import React from 'react';
import { render, screen, act, findByText, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { CartProvider, useCart, CartContextType } from '../../src/context/CartContext';
import { Product } from '../../src/data/productData';

const mockProduct1: Product = {
    codigo: 'P001', nombre: 'Juego 1', precio: 10000, stock: 10,
    categoria: 'juegos', descripcion: '', stockCritico: 2, imagen: ''
};
const mockProduct2: Product = {
    codigo: 'P002', nombre: 'Juego 2', precio: 5000, stock: 5,
    categoria: 'juegos', descripcion: '', stockCritico: 2, imagen: ''
};

const TestComponent = () => {
    const {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount
    } = useCart() as CartContextType;

    return (
        <div>
            <div data-testid="item-count">{getCartItemCount()}</div>
            <div data-testid="total-price">{getCartTotal()}</div>
            <div data-testid="item-list">
                {cartItems.map(item => (
                    <span key={item.codigo}>{item.nombre} (x{item.quantity})</span>
                ))}
            </div>

            <button onClick={() => addToCart(mockProduct1)}>Add P1</button>
            <button onClick={() => addToCart(mockProduct2)}>Add P2</button>
            <button onClick={() => updateQuantity('P001', 1)}>Inc P1</button>
            <button onClick={() => updateQuantity('P001', -1)}>Dec P1</button>
            <button onClick={() => removeFromCart('P002')}>Remove P2</button>
            <button onClick={() => clearCart()}>Clear All</button>
        </div>
    );
};

const renderWithCartProvider = () => {
    return render(
        <CartProvider>
            <TestComponent />
        </CartProvider>
    );
};

describe('CartContext', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('debe iniciar con el carrito vacío', () => {
        renderWithCartProvider();
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
        expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });

    test('addToCart debe agregar un producto nuevo', async () => {
        renderWithCartProvider();
        const addButton = screen.getByText('Add P1');

        act(() => {
            addButton.click();
        });

        expect(await screen.findByText('Juego 1 (x1)')).toBeInTheDocument();
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
        expect(screen.getByTestId('total-price')).toHaveTextContent('10000');

        const storedCart = JSON.parse(localStorage.getItem('carrito') || '[]');
        expect(storedCart).toHaveLength(1);
        expect(storedCart[0].codigo).toBe('P001');
    });

    test('addToCart debe incrementar la cantidad si el producto ya existe', async () => {
        renderWithCartProvider();
        const addButton = screen.getByText('Add P1');

        act(() => {
            addButton.click();
        });

        expect(await screen.findByText('Juego 1 (x1)')).toBeInTheDocument();

        act(() => {
            addButton.click();
        });

        expect(await screen.findByText('Juego 1 (x2)')).toBeInTheDocument();

        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
        expect(screen.getByTestId('total-price')).toHaveTextContent('20000');
    });

    test('updateQuantity debe modificar la cantidad (incrementar)', async () => {
        renderWithCartProvider();
        act(() => { screen.getByText('Add P1').click(); });
        expect(await screen.findByText('Juego 1 (x1)')).toBeInTheDocument();

        const incButton = screen.getByText('Inc P1');
        act(() => {
            incButton.click();
        });

        expect(await screen.findByText('Juego 1 (x2)')).toBeInTheDocument();
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
        expect(screen.getByTestId('total-price')).toHaveTextContent('20000');
    });

    test('updateQuantity debe remover el item si la cantidad llega a 0 (decrementar)', async () => {
        renderWithCartProvider();
        act(() => { screen.getByText('Add P1').click(); });
        expect(await screen.findByText('Juego 1 (x1)')).toBeInTheDocument();

        const decButton = screen.getByText('Dec P1');
        act(() => {
            decButton.click();
        });

        await waitFor(() => {
            expect(screen.queryByText('Juego 1 (x1)')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
        expect(screen.getByTestId('total-price')).toHaveTextContent('0');
        expect(screen.getByTestId('item-list')).toBeEmptyDOMElement();
    });

    test('removeFromCart debe eliminar un producto', async () => {
        renderWithCartProvider();
        act(() => { screen.getByText('Add P1').click(); });
        act(() => { screen.getByText('Add P2').click(); });
        expect(await screen.findByText('Juego 1 (x1)')).toBeInTheDocument();
        expect(await screen.findByText('Juego 2 (x1)')).toBeInTheDocument();
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');

        const removeButton = screen.getByText('Remove P2');
        act(() => {
            removeButton.click();
        });

        await waitFor(() => {
            expect(screen.queryByText('Juego 2 (x1)')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
        expect(screen.getByTestId('total-price')).toHaveTextContent('10000');
    });

    test('clearCart debe vaciar el carrito', async () => {
        renderWithCartProvider();
        act(() => { screen.getByText('Add P1').click(); });
        act(() => { screen.getByText('Add P2').click(); });
        expect(await screen.findByText('Juego 1 (x1)')).toBeInTheDocument();
        expect(await screen.findByText('Juego 2 (x1)')).toBeInTheDocument();
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');

        const clearButton = screen.getByText('Clear All');
        act(() => {
            clearButton.click();
        });

        await waitFor(() => {
            expect(screen.queryByText('Juego 1 (x1)')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
        expect(screen.getByTestId('total-price')).toHaveTextContent('0');
        expect(localStorage.getItem('carrito')).toBe('[]');
    });

    test('debe calcular el total y la cantidad de items correctamente', async () => {
        renderWithCartProvider();
        act(() => { screen.getByText('Add P1').click(); });
        await screen.findByText('Juego 1 (x1)');

        act(() => { screen.getByText('Add P1').click(); });
        await screen.findByText('Juego 1 (x2)');

        act(() => { screen.getByText('Add P2').click(); });
        await screen.findByText('Juego 2 (x1)');

        expect(screen.getByTestId('item-count')).toHaveTextContent('3');
        expect(screen.getByTestId('total-price')).toHaveTextContent('25000');
    });

    test('debe cargar el carrito desde localStorage al iniciar', async () => {
        const mockCart = [{ ...mockProduct1, quantity: 2 }];
        localStorage.setItem('carrito', JSON.stringify(mockCart));
    
        renderWithCartProvider();

        expect(await screen.findByText('Juego 1 (x2)')).toBeInTheDocument();
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
        expect(screen.getByTestId('total-price')).toHaveTextContent('20000');
    });

});