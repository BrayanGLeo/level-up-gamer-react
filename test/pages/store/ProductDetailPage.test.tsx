import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ProductDetailPage from '../../../src/pages/store/ProductDetailPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../../src/data/productData', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        getProductByCode: vi.fn((code: string) => ({
            codigo: code,
            nombre: 'MockProduct',
            descripcion: 'desc',
            precio: 1000,
            stock: 2,
            stockCritico: 1,
            categoria: 'cat',
            imagen: ''
        }))
    };
});

vi.mock('../../../src/context/CartContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useCart: vi.fn()
    };
});

import { useCart } from '../../../src/context/CartContext';
import * as pd from '../../../src/data/productData';

describe('ProductDetailPage', () => {
    const mockUseCart = useCart as vi.Mock;

    beforeEach(() => {
        mockUseCart.mockClear();
        mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    });

    test('muestra botón Agotado y está deshabilitado cuando stock = 0', () => {
        (pd.getProductByCode as vi.Mock).mockReturnValue({
            codigo: 'S0', nombre: 'SinStock', descripcion: 'd', precio: 10, stock: 0, stockCritico: 0, categoria: 'c', imagen: ''
        });

        render(
            <MemoryRouter initialEntries={["/producto/S0"]}>
                <Routes>
                    <Route path="/producto/:codigo" element={<ProductDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        const btn = screen.getByRole('button', { name: /Agotado/i });
        expect(btn).toBeDisabled();
        expect(btn.textContent).toContain('Agotado');
    });

    test('muestra mensaje de producto no encontrado si getProductByCode devuelve undefined', () => {
        (pd.getProductByCode as vi.Mock).mockReturnValue(undefined);
        render(
            <MemoryRouter initialEntries={["/producto/UNKNOWN"]}>
                <Routes>
                    <Route path="/producto/:codigo" element={<ProductDetailPage />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();
    });

    test('si existe producto, agrega al carrito y muestra modal', () => {
        (pd.getProductByCode as vi.Mock).mockReturnValue({
            codigo: 'X1', nombre: 'MP', descripcion: 'd', precio: 100, stock: 2, stockCritico: 1, categoria: 'c', imagen: ''
        });

        const mockAddToCart = vi.fn();
        mockUseCart.mockReturnValue({ addToCart: mockAddToCart });

        render(
            <MemoryRouter initialEntries={["/producto/X1"]}>
                <Routes>
                    <Route path="/producto/:codigo" element={<ProductDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        const addBtn = screen.getByRole('button', { name: /Agregar al Carrito|Agregar/i });
        fireEvent.click(addBtn);

        expect(mockAddToCart).toHaveBeenCalled();
        expect(screen.getAllByText(/Añadido al carrito|¡Añadido al carrito!/i).length >= 0).toBeTruthy();
    });

    test('muestra especificaciones cuando existen', () => {
        (pd.getProductByCode as vi.Mock).mockReturnValue({
            codigo: 'SP', nombre: 'SpecProd', descripcion: 'd', precio: 10, stock: 1, stockCritico: 0, categoria: 'c', imagen: '',
            specifications: {
                'Hardware': { 'CPU': '3.0GHz', 'RAM': '16GB' },
                'Dimensions': { 'Weight': '1kg' }
            }
        });

        render(
            <MemoryRouter initialEntries={["/producto/SP"]}>
                <Routes>
                    <Route path="/producto/:codigo" element={<ProductDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Hardware')).toBeInTheDocument();
        expect(screen.getByText('CPU')).toBeInTheDocument();
        expect(screen.getByText('3.0GHz')).toBeInTheDocument();
        expect(screen.getByText('RAM')).toBeInTheDocument();
        expect(screen.getByText('16GB')).toBeInTheDocument();
    });
});