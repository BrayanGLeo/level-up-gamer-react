import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CatalogoPage from '../../../src/pages/store/CatalogoPage';
import { useCart } from '../../../src/context/CartContext';
import * as productData from '../../../src/data/productData';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: (props) => <a href={props.to} {...props}>{props.children}</a>
}));
jest.mock('../../context/CartContext', () => ({
    useCart: jest.fn(),
}));

const mockProducts = [
    { codigo: 'P001', nombre: 'Juego de PS5', categoria: 'juegos', precio: 50000, descripcion: 'Juego' },
    { codigo: 'P002', nombre: 'Mouse Gamer', categoria: 'accesorios', precio: 30000, descripcion: 'Accesorio' },
    { codigo: 'P003', nombre: 'Consola Xbox', categoria: 'consolas', precio: 500000, descripcion: 'Consola' }
];

const mockGetProducts = jest.spyOn(productData, 'getProducts');

const mockUseCart = useCart;

describe('CatalogoPage', () => {

    beforeEach(() => {
        mockGetProducts.mockReturnValue(mockProducts);
        mockUseCart.mockReturnValue({ addToCart: jest.fn() });

        render(
            <BrowserRouter>
                <CatalogoPage />
            </BrowserRouter>
        );
    });

    test('renderiza todos los productos inicialmente', () => {
        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        expect(screen.getByText('Consola Xbox')).toBeInTheDocument();
    });

    test('filtra productos por la barra de búsqueda', () => {
        const searchInput = screen.getByPlaceholderText(/Buscar por nombre.../i);
        fireEvent.change(searchInput, { target: { value: 'Mouse' } });

        expect(screen.queryByText('Juego de PS5')).not.toBeInTheDocument();
        expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        expect(screen.queryByText('Consola Xbox')).not.toBeInTheDocument();
    });

    test('filtra productos por categoría', () => {
        const filterButton = screen.getByText('Filtros');
        fireEvent.click(filterButton);

        const categoryButton = screen.getByText('Juegos');
        fireEvent.click(categoryButton);

        expect(screen.getByText('Juego de PS5')).toBeInTheDocument();
        expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
        expect(screen.queryByText('Consola Xbox')).not.toBeInTheDocument();
    });

    test('muestra mensaje si no hay resultados', () => {
        const searchInput = screen.getByPlaceholderText(/Buscar por nombre.../i);
        fireEvent.change(searchInput, { target: { value: 'Producto Inexistente' } });

        expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
    });
});