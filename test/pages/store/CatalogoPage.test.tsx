import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CatalogoPage from '../../../src/pages/store/CatalogoPage';
import { CartProvider } from '../../../src/context/CartContext';
import * as api from '../../../src/utils/api';
import { Product } from '../../../src/data/productData';

vi.mock('../../../src/utils/api', () => ({
    getProductsApi: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});

const mockAddToCart = vi.fn();
vi.mock('../../../src/context/CartContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useCart: () => ({ addToCart: mockAddToCart, cartItems: [] }),
        CartProvider: ({ children }: any) => <div>{children}</div>
    };
});

const mockProducts: Product[] = [
    { codigo: 'P001', nombre: 'Juego de PS5', categoria: 'juegos', precio: 50000, descripcion: 'Juego', stock: 1, stockCritico: 1, imagen: '' },
    { codigo: 'P002', nombre: 'Mouse Gamer', categoria: 'accesorios', precio: 30000, descripcion: 'Accesorio', stock: 1, stockCritico: 1, imagen: '' },
    { codigo: 'P003', nombre: 'Consola Xbox', categoria: 'consolas', precio: 500000, descripcion: 'Consola', stock: 1, stockCritico: 1, imagen: '' }
];

const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('CatalogoPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        consoleSpy.mockClear();
        (api.getProductsApi as any).mockResolvedValue(mockProducts);
    });

    test('renderiza todos los productos después de cargar', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CatalogoPage />
            </BrowserRouter>
        );
        await waitFor(() => expect(screen.getByText('Juego de PS5')).toBeInTheDocument());
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    });

    test('maneja error al cargar productos (API fail)', async () => {
        (api.getProductsApi as any).mockRejectedValue(new Error('Error 500'));

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CatalogoPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Error al cargar los productos/i)).toBeInTheDocument();
        });
        expect(consoleSpy).toHaveBeenCalled();
    });

    test('filtra productos por la barra de búsqueda', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CatalogoPage />
            </BrowserRouter>
        );
        await waitFor(() => expect(screen.getByText('Juego de PS5')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText(/Buscar por nombre.../i);
        fireEvent.change(searchInput, { target: { value: 'Mouse' } });

        expect(screen.queryByText('Juego de PS5')).not.toBeInTheDocument();
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    });

    test('filtra productos por categoría', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CatalogoPage />
            </BrowserRouter>
        );
        await waitFor(() => expect(screen.getByText('Juego de PS5')).toBeInTheDocument());

        const filterButton = screen.getByText('Filtros');
        await act(async () => fireEvent.click(filterButton));

        const categoryButton = screen.getByText('Juegos');
        await act(async () => fireEvent.click(categoryButton));

        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
    });

    test('muestra mensaje si no hay resultados', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CatalogoPage />
            </BrowserRouter>
        );
        await waitFor(() => expect(screen.getByText('Juego de PS5')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText(/Buscar por nombre.../i);
        fireEvent.change(searchInput, { target: { value: 'Producto Inexistente' } });

        expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
    });

    test('al hacer clic en "Agregar", se llama a addToCart y se muestra el modal', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CatalogoPage />
            </BrowserRouter>
        );
        await waitFor(() => expect(screen.getByText('Juego de PS5')).toBeInTheDocument());

        const addButton = screen.getAllByText('Agregar')[0];
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]);
        expect(screen.getByText('¡Añadido al carrito!')).toBeInTheDocument();
    });
});