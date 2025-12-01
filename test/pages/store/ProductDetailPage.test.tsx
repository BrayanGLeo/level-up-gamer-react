import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ProductDetailPage from '../../../src/pages/store/ProductDetailPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import * as api from '../../../src/utils/api';

vi.mock('../../../src/utils/api', () => ({
    getProductByCodeApi: vi.fn(),
}));

const mockAddToCart = vi.fn();
vi.mock('../../../src/context/CartContext', async () => {
    return { useCart: () => ({ addToCart: mockAddToCart }) };
});

const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

describe('ProductDetailPage', () => {
    beforeEach(() => vi.clearAllMocks());

    test('renderiza fallback de imagen si no hay URL', async () => {
        const productNoImg = {
            codigo: 'NOIMG', nombre: 'Sin Imagen', precio: 100, stock: 5, categoria: 'c',
            imagen: '',
            descripcion: 'desc'
        };
        (api.getProductByCodeApi as any).mockResolvedValue(productNoImg);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/NOIMG"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Sin Imagen')).toBeInTheDocument());
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://via.placeholder.com/400?text=Sin+Imagen');
    });

    test('abre Y CIERRA el modal al agregar al carrito', async () => {
        const product = { codigo: 'P1', nombre: 'Prod Modal', precio: 100, stock: 5, categoria: 'c', imagen: 'img.jpg', descripcion: '' };
        (api.getProductByCodeApi as any).mockResolvedValue(product);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/P1"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Prod Modal')).toBeInTheDocument());

        const addBtn = screen.getByRole('button', { name: /Agregar al Carrito/i });
        fireEvent.click(addBtn);

        const modalTitle = await screen.findByText('¡Añadido al carrito!');
        expect(modalTitle).toBeInTheDocument();

        const closeBtn = screen.getByText('Seguir Comprando');
        fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByText('¡Añadido al carrito!')).not.toBeInTheDocument();
        });
    });

    test('renderiza features y specs', async () => {
        const product = {
            codigo: 'C1', nombre: 'Full', precio: 10, stock: 5, categoria: 'Gamer', imagen: '', descripcion: 'desc',
            features: ['Feature 1'],
            specifications: { 'General': { 'Peso': '1kg' } }
        };
        (api.getProductByCodeApi as any).mockResolvedValue(product);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/C1"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Feature 1')).toBeInTheDocument());

        const specsTab = screen.getByRole('tab', { name: /Especificaciones/i });
        fireEvent.click(specsTab);

        expect(screen.getByText('General')).toBeInTheDocument();
        expect(screen.getByText('Peso')).toBeInTheDocument();
    });

    test('renderiza sin features', async () => {
        const product = {
            codigo: 'C2', nombre: 'NoFeat', precio: 10, stock: 5, categoria: 'Gamer', imagen: '', descripcion: 'Solo desc',
            features: [],
            specifications: {}
        };
        (api.getProductByCodeApi as any).mockResolvedValue(product);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/C2"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Solo desc')).toBeInTheDocument());
        expect(screen.queryByText('Características Principales:')).not.toBeInTheDocument();
    });

    test('renderiza mensaje cuando no hay specs', async () => {
        const product = {
            codigo: 'C3', nombre: 'NoSpecs', precio: 10, stock: 5, categoria: 'Gamer', imagen: '', descripcion: 'desc',
            features: [], specifications: {}
        };
        (api.getProductByCodeApi as any).mockResolvedValue(product);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/C3"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('NoSpecs')).toBeInTheDocument());
        const specsTab = screen.getByRole('tab', { name: /Especificaciones/i });
        fireEvent.click(specsTab);
        expect(screen.getByText(/No hay especificaciones técnicas/i)).toBeInTheDocument();
    });

    test('botón deshabilitado si no hay stock', async () => {
        const product = { codigo: 'C4', nombre: 'Producto Sin Stock', precio: 10, stock: 0, categoria: 'Gamer', imagen: '', descripcion: 'desc' };
        (api.getProductByCodeApi as any).mockResolvedValue(product);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/C4"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Producto Sin Stock')).toBeInTheDocument());
        const btn = screen.getByRole('button', { name: /Agotado/i });
        expect(btn).toBeDisabled();
    });

    test('maneja error de carga', async () => {
        (api.getProductByCodeApi as any).mockRejectedValue(new Error('Fail'));
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={["/producto/ERR"]}>
                <Routes><Route path="/producto/:codigo" element={<ProductDetailPage />} /></Routes>
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument());
    });
});