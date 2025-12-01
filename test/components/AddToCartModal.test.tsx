import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter as MemoryRouter } from 'react-router-dom';
import AddToCartModal from '../../src/components/AddToCartModal';
import { Product } from '../../src/data/productData';

describe('AddToCartModal (extra)', () => {
    test('no renderiza si product es null', () => {
        const { container } = render(<AddToCartModal show={true} onHide={() => {}} product={null} /> as any);
        expect(container).toBeEmptyDOMElement();
    });
    test('renderiza información y botones, onHide es llamado', () => {
        const mockOnHide = vi.fn();
        const product = { codigo: 'X1', nombre: 'P', descripcion: '', precio: 1000, stock: 1, stockCritico: 1, categoria: 't', imagen: 'img' } as Product;

        render(
            <MemoryRouter>
                <AddToCartModal show={true} onHide={mockOnHide} product={product} />
            </MemoryRouter>
        );

        expect(screen.getByText('¡Añadido al carrito!')).toBeInTheDocument();
        expect(screen.getByText('P')).toBeInTheDocument();
        const seguirBtn = screen.getByText(/Seguir Comprando/i);
        fireEvent.click(seguirBtn);
        expect(mockOnHide).toHaveBeenCalled();
    });
});
