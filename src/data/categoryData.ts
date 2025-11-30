export interface Category {
    id: number;
    nombre: string;
}

type CategoryInput = {
    id: number | null;
    nombre: string;
}

const CATEGORIES_KEY = 'categories';

export const getCategories = (): Category[] => {
    try {
        const storedCategories = localStorage.getItem(CATEGORIES_KEY);
        if (storedCategories) {
            return JSON.parse(storedCategories) as Category[];
        }

        const initialCategories: Category[] = [
            { id: 1, nombre: 'Juegos' },
            { id: 2, nombre: 'Accesorios' },
            { id: 3, nombre: 'Consolas y PC' }
        ];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
        return initialCategories;
    } catch (error) {
        console.error("Error initializing categories", error);
        return [];
    }
};

export const getCategoryById = (id: number): Category | undefined => {
    const categories = getCategories();
    return categories.find(c => c.id === id);
};

export const saveCategory = (category: CategoryInput): Category => {
    let categories = getCategories();

    if (category.id) {
        const index = categories.findIndex(c => c.id === category.id);
        if (index > -1) {
            categories[index] = { ...categories[index], ...category, id: category.id as number };
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
            return categories[index];
        }
    }

    const newId = Date.now();
    const newCategory: Category = { id: newId, nombre: category.nombre };
    categories.push(newCategory);

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
};

export const deleteCategory = (id: number): boolean => {
    let categories = getCategories();
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return true;
};