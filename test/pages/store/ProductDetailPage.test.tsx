import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ProductDetailPage from '../../../src/pages/store/ProductDetailPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as api from '../../../src/utils/api';
import { Product } from '../../../src/data/productData';

vi.mock('../../../src/utils/api', () => ({
    getProductByCodeApi: vi.fn(),
}));

const mockAddToCart = vi.fn();
vi.mock('../../../src/context/CartContext', async (importOriginal) => {
    return {
        useCart: () => ({
            addToCart: mockAddToCart
        }),
    };
});

describe('ProductDetailPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('muestra botón Agotado y está deshabilitado cuando stock = 0', async () => {
        const noStockProduct = { codigo: 'S0', nombre: 'SinStock', stock: 0, precio: 99, descripcion: 'd', categoria: 'c', imagen: '' };
        (api.getProductByCodeApi as any).mockResolvedValue(noStockProduct);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/S0"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        // Esperar a que cargue
        await waitFor(() => expect(screen.getByText('SinStock')).toBeInTheDocument());

        const btn = screen.getByRole('button', { name: /Agotado/i });
        expect(btn).toBeDisabled();
    });

    test('muestra mensaje de producto no encontrado si API falla o devuelve null', async () => {
        (api.getProductByCodeApi as any).mockRejectedValue(new Error("Not found"));
        
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/UNKNOWN"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument());
    });

    test('si existe producto, agrega al carrito y muestra modal', async () => {
        const product: Product = { codigo: 'X1', nombre: 'MP', precio: 100, stock: 2, categoria: 'c', imagen: '', descripcion: '' };
        (api.getProductByCodeApi as any).mockResolvedValue(product);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/X1"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('MP')).toBeInTheDocument());

        const addBtn = screen.getByRole('button', { name: /Agregar al Carrito/i });
        fireEvent.click(addBtn);

        expect(mockAddToCart).toHaveBeenCalledWith(product);
        expect(screen.getByText(/Añadido al carrito/i)).toBeInTheDocument();
    });

    test('muestra mensaje alternativo cuando no hay especificaciones', async () => {
        const productWithoutSpecs: Product = {
            codigo: 'NOSPEC', nombre: 'No Specs', descripcion: 'd', precio: 10, stock: 1, categoria: 'c', imagen: '',
            specifications: {}
        };
        (api.getProductByCodeApi as any).mockResolvedValue(productWithoutSpecs);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/NOSPEC"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('No Specs')).toBeInTheDocument());

        const specsTab = screen.getByRole('tab', { name: /Especificaciones/i });
        fireEvent.click(specsTab);

        expect(screen.getByText('No hay especificaciones técnicas detalladas disponibles en este momento.')).toBeInTheDocument();
    });
});