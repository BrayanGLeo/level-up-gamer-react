import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ProductDetailPage from '../../../src/pages/store/ProductDetailPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as pd from '../../../src/data/productData';
import { Product } from '../../../src/data/productData';
import { useCart } from '../../../src/context/CartContext';

vi.mock('../../../src/data/productData', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        getProductByCode: vi.fn(),
    };
});

vi.mock('../../../src/context/CartContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useCart: vi.fn(),
    };
});

describe('ProductDetailPage', () => {
    const mockUseCart = useCart as vi.Mock;

    beforeEach(() => {
        mockUseCart.mockClear();
        mockUseCart.mockReturnValue({ addToCart: vi.fn() });
        (pd.getProductByCode as vi.Mock).mockClear();
    });

    test('muestra botón Agotado y está deshabilitado cuando stock = 0', () => {
        (pd.getProductByCode as vi.Mock).mockReturnValue({
            codigo: 'S0', nombre: 'SinStock', stock: 0, precio: 99, descripcion: 'd', categoria: 'c', imagen: ''
        });

        render(
            <MemoryRouter initialEntries={["/producto/S0"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        const btn = screen.getByRole('button', { name: /Agotado/i });
        expect(btn).toBeDisabled();
    });

    test('muestra mensaje de producto no encontrado si getProductByCode devuelve undefined', () => {
        (pd.getProductByCode as vi.Mock).mockReturnValue(undefined);
        render(
            <MemoryRouter initialEntries={["/producto/UNKNOWN"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();
    });

    test('si existe producto, agrega al carrito y muestra modal', () => {
        const product: Product = { codigo: 'X1', nombre: 'MP', precio: 100, stock: 2, categoria: 'c', imagen: '', descripcion: '' };
        (pd.getProductByCode as vi.Mock).mockReturnValue(product);

        const mockAddToCart = vi.fn();
        mockUseCart.mockReturnValue({ addToCart: mockAddToCart });

        render(
            <MemoryRouter initialEntries={["/producto/X1"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        const addBtn = screen.getByRole('button', { name: /Agregar al Carrito/i });
        fireEvent.click(addBtn);

        expect(mockAddToCart).toHaveBeenCalledWith(product);
        expect(screen.getByText(/Añadido al carrito/i)).toBeInTheDocument();
    });

    test('muestra la descripción y las características del producto en su pestaña', () => {
        const productWithFeatures: Product = {
            codigo: 'FEAT', nombre: 'Features Product', descripcion: 'Esta es la descripción principal.',
            precio: 10, stock: 1, categoria: 'c', imagen: '',
            features: ['Característica 1', 'Característica 2']
        };
        (pd.getProductByCode as vi.Mock).mockReturnValue(productWithFeatures);

        render(
            <MemoryRouter initialEntries={["/producto/FEAT"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Descripción General')).toBeInTheDocument();
        expect(screen.getByText('Esta es la descripción principal.')).toBeInTheDocument();
        expect(screen.getByText('Características Principales:')).toBeInTheDocument();
        expect(screen.getByText('Característica 1')).toBeInTheDocument();
        expect(screen.getByText('Característica 2')).toBeInTheDocument();
    });

    test('muestra mensaje alternativo cuando no hay especificaciones', () => {
        const productWithoutSpecs: Product = {
            codigo: 'NOSPEC', nombre: 'No Specs', descripcion: 'd', precio: 10, stock: 1, categoria: 'c', imagen: '',
            specifications: {}
        };
        (pd.getProductByCode as vi.Mock).mockReturnValue(productWithoutSpecs);

        render(
            <MemoryRouter initialEntries={["/producto/NOSPEC"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        const specsTab = screen.getByRole('tab', { name: /Especificaciones/i });
        fireEvent.click(specsTab);

        expect(screen.getByText('No hay especificaciones técnicas detalladas para este producto.')).toBeInTheDocument();
    });

    test('muestra mensaje alternativo cuando specifications es undefined', () => {
        const productWithoutSpecs: Product = {
            codigo: 'NOSPEC-UNDEF', nombre: 'No Specs Undefined', descripcion: 'd', precio: 10, stock: 1, categoria: 'c', imagen: '',
        };
        (pd.getProductByCode as vi.Mock).mockReturnValue(productWithoutSpecs);

        render(
            <MemoryRouter initialEntries={["/producto/NOSPEC-UNDEF"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        const specsTab = screen.getByRole('tab', { name: /Especificaciones/i });
        fireEvent.click(specsTab);

        expect(screen.getByText('No hay especificaciones técnicas detalladas para este producto.')).toBeInTheDocument();
    });

    test('muestra especificaciones cuando se hace clic en la pestaña correspondiente', () => {
        const productWithSpecs: Product = {
            codigo: 'SP', nombre: 'SpecProd', descripcion: 'd', precio: 10, stock: 1, categoria: 'c', imagen: '',
            specifications: { 'Grupo': { 'Spec': 'Valor' } }
        };
        (pd.getProductByCode as vi.Mock).mockReturnValue(productWithSpecs);

        render(
            <MemoryRouter initialEntries={["/producto/SP"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        const specsTab = screen.getByRole('tab', { name: /Especificaciones/i });
        fireEvent.click(specsTab);

        expect(screen.getByText('Grupo')).toBeInTheDocument();
        expect(screen.getByText('Spec')).toBeInTheDocument();
        expect(screen.getByText('Valor')).toBeInTheDocument();
    });
});