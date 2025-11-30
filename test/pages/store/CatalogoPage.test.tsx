import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, SpyInstance } from 'vitest';
import CatalogoPage from '../../../src/pages/store/CatalogoPage';
import { useCart, CartProvider } from '../../../src/context/CartContext';
import * as productData from '../../../src/data/productData';
import { Product } from '../../../src/data/productData';

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});
vi.mock('../../../src/context/CartContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useCart: vi.fn(),
    };
});

const mockProducts: Product[] = [
    { codigo: 'P001', nombre: 'Juego de PS5', categoria: 'juegos', precio: 50000, descripcion: 'Juego', stock: 1, stockCritico: 1, imagen: '' },
    { codigo: 'P002', nombre: 'Mouse Gamer', categoria: 'accesorios', precio: 30000, descripcion: 'Accesorio', stock: 1, stockCritico: 1, imagen: '' },
    { codigo: 'P003', nombre: 'Consola Xbox', categoria: 'consolas', precio: 500000, descripcion: 'Consola', stock: 1, stockCritico: 1, imagen: '' }
];

let mockGetProducts: SpyInstance<[], Product[]>;

const mockUseCart = useCart as vi.Mock;

describe('CatalogoPage', () => {

    beforeEach(() => {
        mockGetProducts = vi.spyOn(productData, 'getProducts').mockReturnValue(mockProducts);
        mockUseCart.mockReturnValue({ addToCart: vi.fn() });
    });

    test('renderiza todos los productos inicialmente', () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CartProvider>
                    <CatalogoPage />
                </CartProvider>
            </BrowserRouter>
        );
        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        expect(screen.getByText('Consola Xbox')).toBeInTheDocument();
    });

    test('filtra productos por la barra de búsqueda', () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CartProvider>
                    <CatalogoPage />
                </CartProvider>
            </BrowserRouter>
        );
        const searchInput = screen.getByPlaceholderText(/Buscar por nombre.../i);
        fireEvent.change(searchInput, { target: { value: 'Mouse' } });

        expect(screen.queryByText('Juego de PS5')).not.toBeInTheDocument();
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        expect(screen.queryByText('Consola Xbox')).not.toBeInTheDocument();
    });

    test('filtra productos por categoría', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CartProvider>
                    <CatalogoPage />
                </CartProvider>
            </BrowserRouter>
        );
        const filterButton = screen.getByText('Filtros');
        
        await act(async () => {
            fireEvent.click(filterButton);
        });

        const categoryButton = screen.getByText('Juegos');
        
        await act(async () => {
            fireEvent.click(categoryButton);
        });

        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
        expect(screen.queryByText('Consola Xbox')).not.toBeInTheDocument();
    });

    test('muestra mensaje si no hay resultados', () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CartProvider>
                    <CatalogoPage />
                </CartProvider>
            </BrowserRouter>
        );
        const searchInput = screen.getByPlaceholderText(/Buscar por nombre.../i);
        fireEvent.change(searchInput, { target: { value: 'Producto Inexistente' } });

        expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
    });

    test('al hacer clic en "Agregar", se llama a addToCart y se muestra el modal', () => {
        const addToCartMock = vi.fn();
        mockUseCart.mockReturnValue({ addToCart: addToCartMock });

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CartProvider>
                    <CatalogoPage />
                </CartProvider>
            </BrowserRouter>
        );

        const addButton = screen.getAllByText('Agregar')[0];
        fireEvent.click(addButton);

        expect(addToCartMock).toHaveBeenCalledWith(mockProducts[0]);
        
        expect(screen.getByText('¡Añadido al carrito!')).toBeInTheDocument();
    });

    test('capitaliza todas las categorías correctamente en el dropdown', async () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CartProvider>
                    <CatalogoPage />
                </CartProvider>
            </BrowserRouter>
        );

        const filterButton = screen.getByText('Filtros');
        
        await act(async () => {
            fireEvent.click(filterButton);
        });

        // Verify all categories are capitalized properly
        expect(screen.getByText('Todos')).toBeInTheDocument();
        expect(screen.getByText('Juegos')).toBeInTheDocument();
        expect(screen.getByText('Accesorios')).toBeInTheDocument();
        expect(screen.getByText('Consolas')).toBeInTheDocument();
    });
});