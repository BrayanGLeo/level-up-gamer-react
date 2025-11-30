import { describe, test, expect, beforeEach } from 'vitest';
import { getProducts, getProductByCode, saveProduct, deleteProductByCode } from '../../src/data/productData';

const PRODUCTS_KEY = 'products';

describe('productData', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('getProducts inicializa productos por defecto y guarda en localStorage', () => {
        const products = getProducts();
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);

        const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null');
        expect(Array.isArray(stored)).toBe(true);
        expect(stored.length).toBe(products.length);
    });

    test('getProducts devuelve productos por defecto si localStorage contiene JSON inválido', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem(PRODUCTS_KEY, 'not-json');
        
        const products = getProducts();
        
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
        expect(consoleErrorSpy).toHaveBeenCalled();
        
        consoleErrorSpy.mockRestore();
    });

    test('getProductByCode encuentra producto por código', () => {
        const products = getProducts();
        const sample = products[0];
        const found = getProductByCode(sample.codigo);
        expect(found).toBeDefined();
        expect(found?.codigo).toBe(sample.codigo);
    });

    test('saveProduct agrega y actualiza producto correctamente', () => {
        const newProduct = {
            codigo: 'TT999',
            nombre: 'Test Product',
            descripcion: 'desc',
            precio: 123,
            stock: 1,
            stockCritico: 1,
            categoria: 'test',
            imagen: ''
        } as any;

        saveProduct(newProduct);
        let stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        expect(stored.find((p: any) => p.codigo === 'TT999')).toBeDefined();

        // Update
        newProduct.nombre = 'Test Product Updated';
        saveProduct(newProduct);
        stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        expect(stored.find((p: any) => p.codigo === 'TT999').nombre).toBe('Test Product Updated');
    });

    test('deleteProductByCode elimina producto', () => {
        const products = getProducts();
        const code = products[0].codigo;
        const res = deleteProductByCode(code);
        expect(res).toBe(true);
        const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        expect(stored.find((p: any) => p.codigo === code)).toBeUndefined();
    });
});
