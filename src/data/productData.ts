export interface Product {
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    stockCritico: number;
    categoria: string;
    imagen: string;
}

const PRODUCTS_KEY = 'products';

const defaultProducts: Product[] = [
    {
        codigo: 'JM001',
        nombre: 'Catan',
        descripcion: 'Un clásico juego de estrategia donde compites por colonizar la isla de Catan.',
        precio: 29990,
        stock: 20,
        stockCritico: 5,
        categoria: 'juegos',
        imagen: 'https://dojiw2m9tvv09.cloudfront.net/10102/product/X_catan9477.jpg?43&time=1757334820'
    },
    {
        codigo: 'JM002',
        nombre: 'Carcassonne',
        descripcion: 'Un juego de colocación de fichas donde construyes el paisaje medieval.',
        precio: 24990,
        stock: 15,
        stockCritico: 5,
        categoria: 'juegos',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0QZhisa2tKRa2YTmjEjXPBMwT3DkYtKgcuQ&s'
    },
    {
        codigo: 'AC001',
        nombre: 'Controlador Xbox Series X',
        descripcion: 'Experiencia de juego cómoda con botones mapeables y respuesta táctil mejorada.',
        precio: 59990,
        stock: 25,
        stockCritico: 5,
        categoria: 'accesorios',
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_851883-MLA54692335944_032023-O.webp'
    },
    {
        codigo: 'AC002',
        nombre: 'Auriculares HyperX Cloud II',
        descripcion: 'Sonido envolvente de calidad con micrófono desmontable y espuma viscoelástica.',
        precio: 79990,
        stock: 10,
        stockCritico: 3,
        categoria: 'accesorios',
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_719345-MLU77945147420_082024-O.webp'
    },
    {
        codigo: 'CO001',
        nombre: 'PlayStation 5',
        descripcion: 'La consola de última generación de Sony, con gráficos impresionantes y carga ultrarrápida.',
        precio: 549990,
        stock: 5,
        stockCritico: 2,
        categoria: 'consolas',
        imagen: 'https://http2.mlstatic.com/D_Q_NP_883946-MLA79964406701_102024-O.webp'
    },
    {
        codigo: 'CG001',
        nombre: 'PC Gamer ASUS ROG Strix',
        descripcion: 'Un potente equipo diseñado para los gamers más exigentes, con los últimos componentes.',
        precio: 1299990,
        stock: 3,
        stockCritico: 1,
        categoria: 'consolas',
        imagen: 'https://www.asus.com/media/Odin/Websites/global/Series/52.png'
    },
    {
        codigo: 'SG001',
        nombre: 'Silla Gamer Secretlab Titan',
        descripcion: 'Diseñada para el máximo confort, con soporte ergonómico y personalización ajustable.',
        precio: 349990,
        stock: 8,
        stockCritico: 2,
        categoria: 'accesorios',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_eJAGG3mPro93cQDCHvq5yis6rEBVfxar3SGGGO3Huic3NRc6l4pv5gYTEpZXS2N5JaI&usqp=CAU'
    },
    {
        codigo: 'MS001',
        nombre: 'Mouse Gamer Logitech G502 HERO',
        descripcion: 'Con sensor de alta precisión y botones personalizables para un control preciso.',
        precio: 49990,
        stock: 30,
        stockCritico: 10,
        categoria: 'accesorios',
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_657872-MLU70840166924_082023-O.webp'
    },
    {
        codigo: 'MP001',
        nombre: 'Mousepad Razer Goliathus',
        descripcion: 'Área de juego amplia con iluminación RGB personalizable y superficie suave.',
        precio: 29990,
        stock: 18,
        stockCritico: 5,
        categoria: 'accesorios',
        imagen: 'https://assets2.razerzone.com/images/pnx.assets/b761ba62aece1bcec7a7d9c998177cb9/razer-goliathus-chroma-3xl-ogimage_1200x630.webp'
    },
    {
        codigo: 'PP001',
        nombre: 'Polera Gamer Personalizada',
        descripcion: 'Camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag.',
        precio: 14990,
        stock: 50,
        stockCritico: 10,
        categoria: 'accesorios',
        imagen: 'https://i.imgur.com/yX3aL8p.jpeg'
    }
];

const getInitialProducts = (): Product[] => {
    try {
        const storedProducts = localStorage.getItem(PRODUCTS_KEY);
        if (storedProducts) {
            return JSON.parse(storedProducts) as Product[];
        }
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
        return defaultProducts;
    } catch (error) {
        console.error("Error al inicializar los productos desde localStorage", error);
        return [];
    }
};

export const getProducts = (): Product[] => {
    return getInitialProducts();
};

export const getProductByCode = (codigo: string): Product | undefined => {
    const products = getInitialProducts();
    return products.find(p => p.codigo === codigo);
};

export const saveProduct = (product: Product): Product => {
    let products = getInitialProducts();
    const index = products.findIndex(p => p.codigo === product.codigo);
    
    if (index > -1) {
        products[index] = product;
    } else {
        products.push(product);
    }
    
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return product;
};

export const deleteProductByCode = (codigo: string): boolean => {
    let products = getInitialProducts();
    products = products.filter(p => p.codigo !== codigo);
    
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return true;
};