import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrderSuccessPage from '../../../src/pages/store/OrderSuccessPage';

jest.mock('jspdf', () => jest.fn());
jest.mock('jspdf-autotable', () => jest.fn());

const mockOrder = {
    number: '123456',
};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: { order: mockOrder }
    }),
    Link: (props) => <a href={props.to} {...props}>{props.children}</a>
}));

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