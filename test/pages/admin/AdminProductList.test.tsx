import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AdminProductList from '../../../src/pages/admin/AdminProductList';
import * as adminService from '../../../src/services/adminService'; 
import { Product } from '../../../src/data/productData';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/services/adminService');

const mockGetAdminProducts = vi.mocked(adminService.getAdminProducts);
const mockDeleteProduct = vi.mocked(adminService.deleteProduct);

describe('AdminProductList', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('muestra productos y permite eliminar (confirmación)', async () => {
        const products: Product[] = [
            { codigo: 'A1', nombre: 'Prod A', categoria: 'cat', precio: 100, stock: 2, stockCritico: 2, imagen: '', features: [], specifications: {} }
        ];
        mockGetAdminProducts.mockResolvedValue(products);
        mockDeleteProduct.mockResolvedValue(undefined);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AdminProductList />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Prod A')).toBeInTheDocument());

        const delButtons = screen.getAllByText(/Eliminar/i);
        fireEvent.click(delButtons[0]);

        const confirmBtn = await screen.findByRole('button', { name: /Confirmar/i });
        await act(async () => {
            fireEvent.click(confirmBtn);
        });

        await waitFor(() => {
            expect(mockDeleteProduct).toHaveBeenCalledWith('A1');
        });
    });

    test('el modal de confirmación se cierra al presionar "Cancelar" y NO elimina', async () => {
        const products: Product[] = [
            { codigo: 'B2', nombre: 'Prod B', categoria: 'cat', precio: 100, stock: 2, stockCritico: 2, imagen: '', features: [], specifications: {} }
        ];
        mockGetAdminProducts.mockResolvedValue(products);

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AdminProductList />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Prod B')).toBeInTheDocument());

        const deleteButton = screen.getAllByText(/Eliminar/i)[0];
        fireEvent.click(deleteButton);

        const modalTitle = await screen.findByText('Confirmar Eliminación');
        expect(modalTitle).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();
        });
        
        expect(mockDeleteProduct).not.toHaveBeenCalled();
    });
});