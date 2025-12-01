import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import ProductCard from '../../src/components/ProductCard';
import { Product } from '../../src/data/productData';

const mockProduct: Product = {
    codigo: 'P001',
    nombre: 'Control de PS5',
    descripcion: 'Control de nueva generación.',
    precio: 69990,
    imagen: 'test.jpg',
    stock: 10,
    stockCritico: 2,
    categoria: 'accesorios'
};

const renderWithRouter = (ui: React.ReactElement) => {
    return render(
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {ui}
        </BrowserRouter>
    );
};

describe('ProductCard', () => {

    test('renderiza la información del producto correctamente', () => {
        const mockAddToCart = vi.fn();
        
        renderWithRouter(<ProductCard product={mockProduct} onAddToCartClick={mockAddToCart} />);

        expect(screen.getByText('Control de PS5')).toBeInTheDocument();
        expect(screen.getByText('Control de nueva generación.')).toBeInTheDocument();
        expect(screen.getByText('$69.990 CLP')).toBeInTheDocument();
        expect(screen.getByAltText('Control de PS5')).toHaveAttribute('src', 'test.jpg');
    });

    test('llama a onAddToCartClick cuando se hace clic en el botón "Agregar"', () => {
        const mockAddToCart = vi.fn();
        
        renderWithRouter(<ProductCard product={mockProduct} onAddToCartClick={mockAddToCart} />);
        
        const addButton = screen.getByRole('button', { name: /Agregar/i });
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledTimes(1);
        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    test('renderiza el botón de "Detalles" que enlaza a la página correcta', () => {
        const mockAddToCart = vi.fn();
        renderWithRouter(<ProductCard product={mockProduct} onAddToCartClick={mockAddToCart} />);

        const detailsLink = screen.getByRole('link', { name: /Detalles/i });
        
        expect(detailsLink).toBeInTheDocument();
        expect(detailsLink).toHaveAttribute('href', '/producto/P001');
    });
});