import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrderSuccessPage from '../../../src/pages/store/OrderSuccessPage';
import { Order } from '../../../src/data/userData';

const saveSpy = vi.fn();

vi.mock('jspdf', () => {
    class JsPDFMock {
        setFontSize = vi.fn();
        text = vi.fn();
        save = saveSpy;
    }
    return { default: JsPDFMock };
});

vi.mock('jspdf-autotable', () => ({
    default: vi.fn().mockImplementation((doc: any) => {
        doc.lastAutoTable = { finalY: 140 };
    })
}));

const baseOrder: Omit<Order, 'number' | 'shipping'> = {
    date: '01-01-2025',
    items: [{ id: 'P1', codigo: 'X1', nombre: 'Producto Test', quantity: 2, precio: 100, image: '' }],
    total: 200,
    customer: {
        id: 'C1',
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '912345678',
        addresses: []
    }
};

describe('OrderSuccessPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        saveSpy.mockClear();
    });

    test('renders success message with order number', () => {
        const order: Order = {
            ...baseOrder,
            number: 123456,
            shipping: { type: 'Retiro en Tienda' }
        };

        render(
            <MemoryRouter initialEntries={[{ state: { order } }]}>
                <OrderSuccessPage />
            </MemoryRouter>
        );

        expect(screen.getByText('¡Pago Correcto!')).toBeInTheDocument();
        expect(screen.getByText(/Tu pedido ha sido realizado con éxito./)).toBeInTheDocument();
        expect(screen.getByText(/Tu número de pedido es #123456./)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Descargar Boleta/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Seguir comprando/i })).toBeInTheDocument();
    });

    test('renders error message when no order state is passed', () => {
        render(
            <MemoryRouter initialEntries={[{ state: null }]}>
                <OrderSuccessPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText(/No se encontró información del pedido./i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Descargar Boleta/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Volver a la tienda/i })).toBeInTheDocument();
    });

    describe('PDF Download Logic', () => {
        test('download receipt for in-store pickup calls save with correct filename', () => {
            const order: Order = {
                ...baseOrder,
                number: 555,
                shipping: { type: 'Retiro en Tienda' }
            };

            render(
                <MemoryRouter initialEntries={[{ state: { order } }]}>
                    <OrderSuccessPage />
                </MemoryRouter>
            );

            const downloadButton = screen.getByRole('button', { name: /Descargar Boleta/i });
            fireEvent.click(downloadButton);

            expect(saveSpy).toHaveBeenCalledWith('boleta_555.pdf');
        });

        test('download receipt for home delivery includes address and calls save', () => {
            const order: Order = {
                ...baseOrder,
                number: 777,
                shipping: {
                    type: 'Despacho a Domicilio',
                    recibeNombre: 'Jane',
                    recibeApellido: 'Doe',
                    calle: 'Av. Siempre Viva',
                    numero: '742',
                    comuna: 'Springfield',
                    region: 'Capital',
                    depto: 'Apt. 1'
                }
            };

            render(
                <MemoryRouter initialEntries={[{ state: { order } }]}>
                    <OrderSuccessPage />
                </MemoryRouter>
            );

            const downloadButton = screen.getByRole('button', { name: /Descargar Boleta/i });
            fireEvent.click(downloadButton);
            
            expect(saveSpy).toHaveBeenCalledWith('boleta_777.pdf');
        });

        test('download receipt for home delivery without "depto" works', () => {
            const order: Order = {
                ...baseOrder,
                number: 888,
                shipping: {
                    type: 'Despacho a Domicilio',
                    recibeNombre: 'Jane',
                    recibeApellido: 'Doe',
                    calle: 'Av. Siempre Viva',
                    numero: '742',
                    comuna: 'Springfield',
                    region: 'Capital',
                }
            };

            render(
                <MemoryRouter initialEntries={[{ state: { order } }]}>
                    <OrderSuccessPage />
                </MemoryRouter>
            );

            const downloadButton = screen.getByRole('button', { name: /Descargar Boleta/i });
            fireEvent.click(downloadButton);
            
            expect(saveSpy).toHaveBeenCalledWith('boleta_888.pdf');
        });
    });
});
