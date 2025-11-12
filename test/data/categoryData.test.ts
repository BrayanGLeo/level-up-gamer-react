import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
    getCategories,
    getCategoryById,
    saveCategory,
    deleteCategory,
    Category
} from '../../src/data/categoryData';

const CATEGORIES_KEY = 'categories';

describe('categoryData', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('getCategories debe retornar las categorías iniciales si localStorage está vacío', () => {
        const categories = getCategories();
        expect(categories).toHaveLength(3);
        expect(categories[0].nombre).toBe('Juegos');
    });

    test('getCategories debe retornar las categorías de localStorage si existen', () => {
        const mockCategories: Category[] = [{ id: 99, nombre: 'Prueba' }];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mockCategories));

        const categories = getCategories();
        expect(categories).toHaveLength(1);
        expect(categories[0].nombre).toBe('Prueba');
    });

    test('getCategoryById debe encontrar una categoría por su ID', () => {
        const category = getCategoryById(1);
        expect(category).toBeDefined();
        expect(category?.nombre).toBe('Juegos');
    });

    test('getCategoryById debe retornar undefined si la categoría no existe', () => {
        const category = getCategoryById(999);
        expect(category).toBeUndefined();
    });

    test('saveCategory debe agregar una nueva categoría (modo creación)', () => {
        const newCategoryInput = { id: null, nombre: 'Merchandising' };
        const savedCategory = saveCategory(newCategoryInput);

        expect(savedCategory.nombre).toBe('Merchandising');
        expect(savedCategory.id).toBeTypeOf('number');

        const categories = getCategories();
        expect(categories).toHaveLength(4);
        expect(categories.find(c => c.nombre === 'Merchandising')).toBeDefined();
    });

    test('saveCategory debe actualizar una categoría existente (modo edición)', () => {
        const updatedCategoryInput = { id: 1, nombre: 'Videojuegos' };
        const savedCategory = saveCategory(updatedCategoryInput);

        expect(savedCategory.id).toBe(1);
        expect(savedCategory.nombre).toBe('Videojuegos');

        const categories = getCategories();
        expect(categories).toHaveLength(3);

        const updatedCategory = getCategoryById(1);
        expect(updatedCategory?.nombre).toBe('Videojuegos');
    });

    test('deleteCategory debe eliminar una categoría', () => {
        let categories = getCategories();
        expect(categories).toHaveLength(3);

        const result = deleteCategory(1);
        expect(result).toBe(true);

        categories = getCategories();
        expect(categories).toHaveLength(2);

        const deletedCategory = getCategoryById(1);
        expect(deletedCategory).toBeUndefined();
    });
});