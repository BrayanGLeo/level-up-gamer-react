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

const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('AdminProductList', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        consoleSpy.mockClear();
    });

    test('carga y muestra la lista de productos con sus badges y variantes de categoría', async () => {
        const products: any[] = [
            { codigo: 'A1', nombre: 'Prod A', stock: 2, stockCritico: 5, precio: 100, categoria: 'CatStringUnique', imagen: '' },
            { codigo: 'B2', nombre: 'Prod B', stock: 8, stockCritico: 5, precio: 100, categoria: { nombre: 'CatObjectUnique' }, imagen: '' },
            { codigo: 'C3', nombre: 'Prod C', stock: 20, stockCritico: 5, precio: 100, categoria: 'OtherCat', imagen: '' }
        ];
        mockGetAdminProducts.mockResolvedValue(products);

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);

        await waitFor(() => expect(screen.getByText('Prod A')).toBeInTheDocument());
        
        expect(screen.getByText('CatStringUnique')).toBeInTheDocument();
        expect(screen.getByText('CatObjectUnique')).toBeInTheDocument();

        expect(screen.getByText('Crítico (2)')).toBeInTheDocument();
        expect(screen.getByText('Bajo (8)')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    test('elimina producto correctamente', async () => {
        mockGetAdminProducts.mockResolvedValue([{ codigo: 'X1', nombre: 'X', stock: 10, stockCritico: 2, precio: 10, categoria: 'c', imagen: '' }]);
        mockDeleteProduct.mockResolvedValue(undefined);

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);
        await waitFor(() => screen.getByText('X'));

        fireEvent.click(screen.getByText('Eliminar'));
        const confirmBtn = await screen.findByRole('button', { name: /Confirmar/i });
        await act(async () => fireEvent.click(confirmBtn));

        await waitFor(() => expect(mockDeleteProduct).toHaveBeenCalledWith('X1'));
        expect(mockGetAdminProducts).toHaveBeenCalledTimes(2); 
    });

    test('maneja error al eliminar (catch block)', async () => {
        mockGetAdminProducts.mockResolvedValue([{ codigo: 'X1', nombre: 'X', stock: 10, stockCritico: 2, precio: 10, categoria: 'c', imagen: '' }]);
        mockDeleteProduct.mockRejectedValue(new Error("Error al borrar"));

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);
        await waitFor(() => screen.getByText('X'));

        fireEvent.click(screen.getByText('Eliminar'));
        const confirmBtn = await screen.findByRole('button', { name: /Confirmar/i });
        await act(async () => fireEvent.click(confirmBtn));

        await waitFor(() => expect(mockDeleteProduct).toHaveBeenCalled());
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error deleting product"), expect.any(Error));
    });

    test('cancela la eliminación', async () => {
        mockGetAdminProducts.mockResolvedValue([{ codigo: 'X1', nombre: 'X', stock: 10, stockCritico: 2, precio: 10, categoria: 'c', imagen: '' }]);

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);
        await waitFor(() => screen.getByText('X'));

        fireEvent.click(screen.getByText('Eliminar'));
        const cancelBtn = await screen.findByRole('button', { name: /Cancelar/i });
        fireEvent.click(cancelBtn);

        await waitFor(() => expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument());
        expect(mockDeleteProduct).not.toHaveBeenCalled();
    });

    test('maneja error de carga inicial', async () => {
        mockGetAdminProducts.mockRejectedValue(new Error("Fail load"));
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);
        
        await waitFor(() => expect(screen.getByText(/Error al cargar productos/i)).toBeInTheDocument());
    });
    
    test('navega a editar', async () => {
        mockGetAdminProducts.mockResolvedValue([{ codigo: 'E1', nombre: 'EditMe', stock: 1, stockCritico: 1, precio: 1, categoria: 'c', imagen: '' }]);
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);
        await waitFor(() => screen.getByText('EditMe'));
        
        fireEvent.click(screen.getByText('Editar'));
        expect(mockNavigate).toHaveBeenCalledWith('/admin/productos/editar/E1');
    });
});