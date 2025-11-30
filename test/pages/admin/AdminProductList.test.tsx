import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AdminProductList from '../../../src/pages/admin/AdminProductList';

vi.mock('../../../src/data/productData', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        getProducts: vi.fn(() => [
            { codigo: 'A1', nombre: 'Prod A', categoria: 'cat', precio: 100, stock: 2, stockCritico: 2, imagen: '' },
            { codigo: 'B2', nombre: 'Prod B', categoria: 'cat', precio: 200, stock: 10, stockCritico: 2, imagen: '' }
        ]),
        deleteProductByCode: vi.fn((c: string) => true)
    };
});

import * as pd from '../../../src/data/productData';

describe('AdminProductList', () => {
    test('muestra productos y permite eliminar (confirmación)', async () => {
        const { MemoryRouter } = require('react-router-dom');
        render(
            <MemoryRouter>
                <AdminProductList />
            </MemoryRouter>
        );

        expect(screen.getByText('Productos')).toBeInTheDocument();
        expect(screen.getByText('Prod A')).toBeInTheDocument();

        const delButtons = screen.getAllByText(/Eliminar/i);
        fireEvent.click(delButtons[0]);

        const confirmBtn = await screen.findByRole('button', { name: /Confirmar/i });
        fireEvent.click(confirmBtn);

        expect(pd.deleteProductByCode).toHaveBeenCalled();
    });
});
