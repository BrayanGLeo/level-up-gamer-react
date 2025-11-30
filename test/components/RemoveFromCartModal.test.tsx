import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import RemoveFromCartModal from '../../src/components/RemoveFromCartModal';

describe('RemoveFromCartModal (extra)', () => {
    test('no renderiza si product es null', () => {
        const { container } = render(<RemoveFromCartModal show={true} onHide={() => {}} onConfirm={() => {}} product={null} /> as any);
        expect(container).toBeEmptyDOMElement();
    });

    test('renderiza y llama onConfirm al confirmar', () => {
        const mockOnHide = vi.fn();
        const mockOnConfirm = vi.fn();
        const product = { codigo: 'X1', nombre: 'P', descripcion: '', precio: 1000, imagen: '', quantity: 1 } as any;

        render(<RemoveFromCartModal show={true} onHide={mockOnHide} onConfirm={mockOnConfirm} product={product} />);

        expect(screen.getByText('¿Eliminar Producto?')).toBeInTheDocument();
        expect(screen.getByText('P')).toBeInTheDocument();

        const confirmBtn = screen.getByText(/Sí, Eliminar/i);
        fireEvent.click(confirmBtn);
        expect(mockOnConfirm).toHaveBeenCalled();
    });
});
