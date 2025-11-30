import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AdminProductList from '../../../src/pages/admin/AdminProductList';
import * as pd from '../../../src/data/productData';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/data/productData');

const mockGetProducts = vi.spyOn(pd, 'getProducts');
const mockDeleteProductByCode = vi.spyOn(pd, 'deleteProductByCode');

describe('AdminProductList', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('muestra productos y permite eliminar (confirmación)', async () => {
        mockGetProducts.mockReturnValue([
            { codigo: 'A1', nombre: 'Prod A', categoria: 'cat', precio: 100, stock: 2, stockCritico: 2, imagen: '' },
            { codigo: 'B2', nombre: 'Prod B', categoria: 'cat', precio: 200, stock: 10, stockCritico: 2, imagen: '' }
        ]);
        mockDeleteProductByCode.mockImplementation(() => true);

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

        expect(pd.deleteProductByCode).toHaveBeenCalledWith('A1');
    });

    test('muestra los badges de stock correctamente', () => {
        mockGetProducts.mockReturnValue([
            { codigo: 'CRITICO', nombre: 'Prod Critico', categoria: 'cat', precio: 100, stock: 2, stockCritico: 5, imagen: '' },
            { codigo: 'BAJO', nombre: 'Prod Bajo', categoria: 'cat', precio: 200, stock: 8, stockCritico: 5, imagen: '' },
            { codigo: 'OK', nombre: 'Prod OK', categoria: 'cat', precio: 300, stock: 20, stockCritico: 5, imagen: '' }
        ]);
        
        render(<MemoryRouter><AdminProductList /></MemoryRouter>);

        expect(screen.getByText('Crítico (2)')).toBeInTheDocument();
        expect(screen.getByText('Bajo (8)')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument(); 
    });

    test('muestra badges con stock crítico por defecto cuando no se especifica', () => {
        mockGetProducts.mockReturnValue([
            { codigo: 'CRITICO-DEF', nombre: 'Prod Critico Defecto', categoria: 'cat', precio: 100, stock: 3, imagen: '' },
            { codigo: 'BAJO-DEF', nombre: 'Prod Bajo Defecto', categoria: 'cat', precio: 200, stock: 7, imagen: '' },
            { codigo: 'OK-DEF', nombre: 'Prod OK Defecto', categoria: 'cat', precio: 300, stock: 15, imagen: '' }
        ]);
        
        render(<MemoryRouter><AdminProductList /></MemoryRouter>);

        expect(screen.getByText('Crítico (3)')).toBeInTheDocument();
        expect(screen.getByText('Bajo (7)')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument(); 
    });

    test('el botón "Editar" navega a la página de edición correcta', () => {
        mockGetProducts.mockReturnValue([
            { codigo: 'EDIT-ME', nombre: 'Prod a Editar', categoria: 'cat', precio: 100, stock: 10, stockCritico: 5, imagen: '' }
        ]);

        render(<MemoryRouter><AdminProductList /></MemoryRouter>);
        
        const editButton = screen.getByRole('button', { name: /Editar/i });
        fireEvent.click(editButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin/productos/editar/EDIT-ME');
    });

    test('el modal de confirmación se cierra al presionar "Cancelar"', async () => {
        mockGetProducts.mockReturnValue([
            { codigo: 'A1', nombre: 'Prod A', categoria: 'cat', precio: 100, stock: 2, stockCritico: 2, imagen: '' }
        ]);

        render(<MemoryRouter><AdminProductList /></MemoryRouter>);

        const deleteButton = screen.getAllByText(/Eliminar/i)[0];
        fireEvent.click(deleteButton);

        expect(await screen.findByText('¿Estás seguro de que quieres eliminar este producto?')).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('¿Estás seguro de que quieres eliminar este producto?')).not.toBeInTheDocument();
        });
        
        expect(pd.deleteProductByCode).not.toHaveBeenCalled();
    });

    test('product with high stock shows success badge', () => {
        const productWithHighStock: Product = {
            codigo: 'HS', nombre: 'HighStock', precio: 100, stock: 15,
            categoria: 'gaming', imagen: '', descripcion: '', stockCritico: 5
        };

        const products = [productWithHighStock];
        mockGetProducts.mockReturnValue(products);

        render(<MemoryRouter><AdminProductList /></MemoryRouter>);

        expect(screen.getByText('15')).toBeInTheDocument();
    });

});
