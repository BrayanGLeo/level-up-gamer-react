import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AdminProductList from '../../../src/pages/admin/AdminProductList';
import * as adminService from '../../../src/services/adminService'; 

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/services/adminService');

const mockGetAdminProducts = vi.mocked(adminService, true).getAdminProducts;
const mockDeleteProduct = vi.mocked(adminService, true).deleteProduct;

describe('AdminProductList', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('muestra productos y permite eliminar (confirmación)', async () => {
        mockGetAdminProducts.mockResolvedValue([
            { codigo: 'A1', nombre: 'Prod A', categoria: 'cat', precio: 100, stock: 2, stockCritico: 2, imagen: '' },
            { codigo: 'B2', nombre: 'Prod B', categoria: 'cat', precio: 200, stock: 10, stockCritico: 2, imagen: '' }
        ]);
        mockDeleteProduct.mockResolvedValue(undefined); // deleteProduct no devuelve nada

        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AdminProductList />
            </MemoryRouter>
        );

        await screen.findByText('Productos'); // Esperar a que los productos se carguen y el título esté presente

        expect(screen.getByText('Prod A')).toBeInTheDocument();

        const delButtons = screen.getAllByText(/Eliminar/i);
        fireEvent.click(delButtons[0]);

        const confirmBtn = await screen.findByRole('button', { name: /Confirmar/i });
        await act(async () => {
            fireEvent.click(confirmBtn);
        });

        await waitFor(() => {
            expect(mockDeleteProduct).toHaveBeenCalledWith('A1');
        });
        await waitFor(() => {
            expect(screen.queryByText('¿Estás seguro de que quieres eliminar este producto?')).not.toBeInTheDocument();
        });
    });

    test('muestra los badges de stock correctamente', async () => {
        mockGetAdminProducts.mockResolvedValue([
            { codigo: 'CRITICO', nombre: 'Prod Critico', categoria: { nombre: 'cat' } as any, precio: 100, stock: 2, stockCritico: 5, imagen: '' },
            { codigo: 'BAJO', nombre: 'Prod Bajo', categoria: { nombre: 'cat' } as any, precio: 200, stock: 8, stockCritico: 5, imagen: '' },
            { codigo: 'OK', nombre: 'Prod OK', categoria: { nombre: 'cat' } as any, precio: 300, stock: 20, stockCritico: 5, imagen: '' }
        ]);
        
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);

        await screen.findByText('Productos'); 

        expect(screen.getByText('Crítico (2)')).toBeInTheDocument();
        expect(screen.getByText('Bajo (8)')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument(); 
    });

    test('muestra badges con stock crítico por defecto cuando no se especifica', async () => {
        mockGetAdminProducts.mockResolvedValue([
            { codigo: 'CRITICO-DEF', nombre: 'Prod Critico Defecto', categoria: { nombre: 'cat' } as any, precio: 100, stock: 3, imagen: '' },
            { codigo: 'BAJO-DEF', nombre: 'Prod Bajo Defecto', categoria: { nombre: 'cat' } as any, precio: 200, stock: 7, imagen: '' },
            { codigo: 'OK-DEF', nombre: 'Prod OK Defecto', categoria: { nombre: 'cat' } as any, precio: 300, stock: 15, imagen: '' }
        ]);
        
        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);

        await screen.findByText('Productos'); 

        expect(screen.getByText('Crítico (3)')).toBeInTheDocument();
        expect(screen.getByText('Bajo (7)')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument(); 
    });

    test('el botón "Editar" navega a la página de edición correcta', async () => {
        mockGetAdminProducts.mockResolvedValue([
            { codigo: 'EDIT-ME', nombre: 'Prod a Editar', categoria: { nombre: 'cat' } as any, precio: 100, stock: 10, stockCritico: 5, imagen: '' }
        ]);

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);
        
        await screen.findByText('Productos'); 

        const editButton = screen.getByRole('button', { name: /Editar/i });
        fireEvent.click(editButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin/productos/editar/EDIT-ME');
    });

    test('el modal de confirmación se cierra al presionar "Cancelar"', async () => {
        mockGetAdminProducts.mockResolvedValue([
            { codigo: 'A1', nombre: 'Prod A', categoria: { nombre: 'cat' } as any, precio: 100, stock: 2, stockCritico: 2, imagen: '' }
        ]);

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);

        await screen.findByText('Productos'); 

        const deleteButton = screen.getAllByText(/Eliminar/i)[0];
        fireEvent.click(deleteButton);

        expect(await screen.findByText('¿Estás seguro de que quieres eliminar este producto?')).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
        await act(async () => {
            fireEvent.click(cancelButton);
        });

        await waitFor(() => {
            expect(screen.queryByText('¿Estás seguro de que quieres eliminar este producto?')).not.toBeInTheDocument();
        });
        
        expect(mockDeleteProduct).not.toHaveBeenCalled();
    });

    test('product with high stock shows success badge', async () => {
        const productWithHighStock: Product = {
            codigo: 'HS', nombre: 'HighStock', precio: 100, stock: 15,
            categoria: { nombre: 'gaming' } as any, imagen: '', descripcion: '', stockCritico: 5
        };

        const products = [productWithHighStock];
        mockGetAdminProducts.mockResolvedValue(products);

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminProductList /></MemoryRouter>);

        await screen.findByText('Productos'); 

        expect(screen.getByText('15')).toBeInTheDocument();
    });

});
