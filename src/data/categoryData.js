const CATEGORIES_KEY = 'categories';
const getInitialCategories = () => {
    try {
        const storedCategories = localStorage.getItem(CATEGORIES_KEY);
        if (storedCategories) {
            return JSON.parse(storedCategories);
        }
        const initialCategories = [
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

export const getCategories = () => {
    return getInitialCategories();
};

export const getCategoryById = (id) => {
    const categories = getInitialCategories();
    return categories.find(c => c.id === id);
};

export const saveCategory = (category) => {
    let categories = getInitialCategories();
    if (category.id) {
        const index = categories.findIndex(c => c.id === category.id);
        if (index > -1) {
            categories[index] = { ...categories[index], ...category };
        }
    } else {
        category.id = Date.now(); 
        categories.push({id: category.id, nombre: category.nombre});
    }
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return category;
};

export const deleteCategory = (id) => {
    let categories = getInitialCategories();    
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return true;
};