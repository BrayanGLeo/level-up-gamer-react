import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import OrderSuccessPage from '../../../src/pages/store/OrderSuccessPage';
import { Order } from '../../../src/data/userData';

vi.mock('jspdf', () => ({
    default: vi.fn(() => ({
        setFontSize: vi.fn(),
        text: vi.fn(),
        save: vi.fn(),
    }))
}));
vi.mock('jspdf-autotable', () => ({
    default: vi.fn()
}));

const mockOrder: Partial<Order> = {
    number: 123456,
};

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useLocation: () => ({
            state: { order: mockOrder }
        }),
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});

describe('OrderSuccessPage', () => {

    test('renderiza mensaje de éxito con N° de orden y botón de descarga', () => {
        render(
            <BrowserRouter>
                <OrderSuccessPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Tu número de pedido es #123456/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Descargar Boleta/i })).toBeInTheDocument();
    });
});