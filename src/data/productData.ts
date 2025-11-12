export type Specifications = {
    [groupTitle: string]: {
        [specName: string]: string;
    };
};

export interface Product {
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    stockCritico: number;
    categoria: string;
    imagen: string;
    features?: string[];
    specifications?: Specifications;
}

const PRODUCTS_KEY = 'products';

const defaultProducts: Product[] = [
    {
        codigo: 'JM001',
        nombre: 'Catan',
        descripcion: 'Un clásico juego de estrategia donde compites por colonizar la isla de Catan. Reúne recursos, comercia y construye para ser el primero en alcanzar 10 puntos de victoria.',
        precio: 29990,
        stock: 20,
        stockCritico: 5,
        categoria: 'juegos',
        imagen: 'https://dojiw2m9tvv09.cloudfront.net/10102/product/X_catan9477.jpg?43&time=1757334820',
        features: [
            "Juego de estrategia y gestión de recursos.",
            "Alta rejugabilidad gracias a su tablero modular.",
            "Fomenta la negociación y el comercio entre jugadores.",
            "Objetivo: Ser el primero en alcanzar 10 Puntos de Victoria."
        ],
        specifications: {
            "Detalles del Juego": {
                "Tipo de Juego": "Estrategia, Negociación",
                "N° de Jugadores": "3 a 4 jugadores (ampliable con expansiones)",
                "Edad Recomendada": "10+ años",
                "Duración": "60 - 90 minutos aprox."
            },
            "Contenido de la Caja": {
                "Hexágonos de Terreno": "19",
                "Piezas de Marco (Mar)": "6",
                "Cartas de Materia Prima": "95",
                "Cartas de Desarrollo": "25",
                "Fichas Numeradas": "18",
                "Figuras (Poblados, Ciudades, Caminos)": "16 ciudades, 20 poblados, 60 caminos",
                "Dados": "2",
                "Figura de Ladrón": "1"
            }
        }
    },
    {
        codigo: 'JM002',
        nombre: 'Carcassonne',
        descripcion: 'Un juego de colocación de fichas donde los jugadores construyen el paisaje medieval de la ciudad francesa de Carcasona, casilla a casilla. Coloca a tus seguidores (meeples) en caminos, ciudades, monasterios y granjas para ganar puntos.',
        precio: 24990,
        stock: 15,
        stockCritico: 5,
        categoria: 'juegos',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0QZhisa2tKRa2YTmjEjXPBMwT3DkYtKgcuQ&s',
        features: [
            "Juego táctico de colocación de losetas.",
            "Reglas sencillas, ideal para familias y nuevos jugadores.",
            "Construye un mapa diferente en cada partida.",
            "Incluye la mini-expansión 'El Río' (en ediciones recientes)."
        ],
        specifications: {
            "Detalles del Juego": {
                "Tipo de Juego": "Colocación de Losetas",
                "N° de Jugadores": "2 a 5 jugadores",
                "Edad Recomendada": "7+ años",
                "Duración": "35 - 45 minutos aprox."
            },
            "Contenido de la Caja (Edición Estándar)": {
                "Losetas de Terreno": "72",
                "Seguidores (Meeples)": "40 (8 en 5 colores)",
                "Tablero de Puntuación": "1",
                "Reglamento": "1"
            }
        }
    },
    {
        codigo: 'AC001',
        nombre: 'Controlador Xbox Series X',
        descripcion: 'Experimenta el diseño modernizado del control inalámbrico de Xbox, con superficies esculpidas y geometría refinada para una mayor comodidad. Incluye agarre texturizado, D-pad híbrido y el nuevo botón Compartir',
        precio: 59990,
        stock: 25,
        stockCritico: 5,
        categoria: 'accesorios',
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_851883-MLA54692335944_032023-O.webp',
        features: [
            "Diseño ergonómico modernizado con agarre texturizado.",
            "Botón 'Compartir' dedicado para capturar y compartir contenido.",
            "Pad direccional (D-pad) híbrido para mayor precisión.",
            "Tecnología Xbox Wireless y Bluetooth® para jugar en consolas, PC y móviles."
        ],
        specifications: {
            "Conectividad": {
                "Xbox": "Tecnología Xbox Wireless",
                "PC y Móvil": "Bluetooth® Low Energy",
                "Cable": "Puerto USB-C"
            },
            "Compatibilidad": {
                "Consolas": "Xbox Series X, Xbox Series S, Xbox One",
                "Sistemas Operativos": "Windows 10/11, Android, iOS"
            },
            "Audio": {
                "Jack de audio": "Conector estéreo de 3,5 mm"
            },
            "Batería": {
                "Tipo": "Pilas AA (incluidas)",
                "Duración": "Hasta 40 horas (variable)"
            }
        }
    },
    {
        codigo: 'AC002',
        nombre: 'Auriculares HyperX Cloud II',
        descripcion: 'Famosos por su comodidad, los HyperX Cloud II ofrecen un sonido envolvente virtual 7.1. Cuentan con almohadillas de espuma viscoelástica y una resistente estructura de aluminio.',
        precio: 79990,
        stock: 10,
        stockCritico: 3,
        categoria: 'accesorios',
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_719345-MLU77945147420_082024-O.webp',
        features: [
            "Sonido envolvente virtual 7.1.",
            "Caja de control de audio avanzada USB.",
            "Comodidad legendaria de espuma viscoelástica HyperX.",
            "Estructura de aluminio resistente.",
            "Micrófono desmontable con cancelación de ruido."
        ],
        specifications: {
            "Auriculares": {
                "Transductor": "Dinámico de 53 mm con imanes de neodimio",
                "Principio de funcionamiento": "Cerrado",
                "Respuesta de frecuencia": "15 Hz-25 000 Hz",
                "Impedancia nominal": "60 Ω por sistema",
                "Acoplamiento auditivo": "Circumaural"
            },
            "Micrófono": {
                "Tipo": "Condensador (electret trasero)",
                "Patrón polar": "Cardioide",
                "Respuesta de frecuencia": "50-18 000 Hz",
                "Conexión": "Conector mini estéreo (3,5 mm)"
            },
            "Conexión": {
                "Tipo": "Conector estéreo jack mini (3,5 mm), USB (con caja de control)"
            }
        }
    },
    {
        codigo: 'CO001',
        nombre: 'PlayStation 5',
        descripcion: 'La consola de última generación de Sony, con gráficos impresionantes y carga ultrarrápida gracias a su SSD. Incluye el innovador control DualSense con retroalimentación háptica y gatillos adaptativos.',
        precio: 549990,
        stock: 5,
        stockCritico: 2,
        categoria: 'consolas',
        imagen: 'https://http2.mlstatic.com/D_Q_NP_883946-MLA79964406701_102024-O.webp',
        features: [
            "SSD de ultra alta velocidad para cargas casi instantáneas.",
            "Trazado de rayos (Ray Tracing) para un realismo increíble.",
            "Salida de video 4K a 120 Hz (requiere TV compatible).",
            "Tecnología de audio 3D 'Tempest' AudioTech.",
            "Incluye control inalámbrico DualSense."
        ],
        specifications: {
            "Procesamiento": {
                "CPU": "AMD Ryzen™ Zen 2 (8 núcleos/16 hilos, hasta 3.5GHz)",
                "GPU": "AMD Radeon RDNA 2 (10.3 TFLOPS, hasta 2.23 GHz)",
                "Memoria": "16 GB GDDR6",
                "Ancho de banda": "448 GB/s"
            },
            "Almacenamiento": {
                "Tipo": "SSD NVMe personalizado",
                "Capacidad": "825 GB (Estándar) o 1 TB (Slim)",
                "Ancho de banda E/S": "5.5 GB/s (Sin formato)"
            },
            "Video y Audio": {
                "Salida de video": "Soporte para 4K 120Hz, 8K, VRR (HDMI 2.1)",
                "Audio": "Tempest 3D AudioTech"
            },
            "Unidad Óptica": {
                "Tipo": "Ultra HD Blu-ray 4K (en versión con disco)"
            }
        }
    },
    {
        codigo: 'CG001',
        nombre: 'PC Gamer ASUS ROG Strix',
        descripcion: 'Un potente equipo diseñado para los gamers más exigentes. Equipado con procesadores de alto rendimiento y gráficos NVIDIA GeForce RTX para dominar cualquier juego. (Las especificaciones son un ejemplo).',
        precio: 1299990,
        stock: 3,
        stockCritico: 1,
        categoria: 'consolas',
        imagen: 'https://www.asus.com/media/Odin/Websites/global/Series/52.png',
        features: [
            "Gráficos NVIDIA® GeForce RTX™ serie 30 (ej. 3060).",
            "Procesador AMD Ryzen™ (ej. Ryzen 7 4800H).",
            "Sistema de refrigeración inteligente ROG.",
            "Iluminación Aura Sync personalizable.",
            "Pantalla de alta tasa de refresco (ej. 144Hz FHD)."
        ],
        specifications: {
            "Ejemplo (Modelo G15)": {
                "Procesador": "AMD Ryzen™ 7 4800H (8 núcleos/16 hilos)",
                "Gráficos": "NVIDIA® GeForce RTX™ 3060 6GB GDDR6",
                "Pantalla": "15.6\" FHD (1920 x 1080) 16:9, 144Hz, Nivel IPS",
                "Memoria": "16GB DDR4 SO-DIMM (Max 32GB)",
                "Almacenamiento": "512GB M.2 NVMe™ PCIe® 3.0 SSD",
                "Puertos": "1x USB 3.2 Gen 2 Tipo-C, 3x USB 3.2 Gen 1 Tipo-A, 1x HDMI 2.1",
                "Redes": "Wi-Fi 6 (802.11ax), Bluetooth® 5.1",
                "Sistema Operativo": "Windows 11 Home"
            }
        }
    },
    {
        codigo: 'SG001',
        nombre: 'Silla Gamer Secretlab Titan',
        descripcion: 'Diseñada para el máximo confort, con soporte ergonómico y personalización ajustable. La serie TITAN Evo combina múltiples tecnologías patentadas para un soporte personalizado.',
        precio: 349990,
        stock: 8,
        stockCritico: 2,
        categoria: 'accesorios',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_eJAGG3mPro93cQDCHvq5yis6rEBVfxar3SGGGO3Huic3NRc6l4pv5gYTEpZXS2N5JaI&usqp=CAU',
        features: [
            "Sistema de soporte lumbar L-ADAPT™ de 4 posiciones.",
            "Almohada magnética para la cabeza de espuma viscoelástica con gel refrigerante.",
            "Reposabrazos 4D metálicos con sistema de reemplazo CloudSwap™.",
            "Asiento ergonómico esculpido 'Pebble'.",
            "Reclinación de respaldo completo de 165°."
        ],
        specifications: {
            "Materiales": {
                "Tapicería": "Piel sintética Secretlab NEO™ (o tela SoftWeave® Plus)",
                "Espuma": "Espuma de curado en frío Secretlab",
                "Estructura": "Acero",
                "Base de ruedas": "Aleación de aluminio (ADC12)"
            },
            "Ajustes (Tamaño Regular)": {
                "Altura recomendada": "170 - 189 cm",
                "Peso recomendado": "< 100 kg",
                "Carga máxima": "130 kg",
                "Reclinación": "85 - 165°",
                "Pistón hidráulico": "Clase 4"
            },
            "Garantía": {
                "Estándar": "Garantía de 5 años (sujeto a extensión)"
            }
        }
    },
    {
        codigo: 'MS001',
        nombre: 'Mouse Gamer Logitech G502 HERO',
        descripcion: 'Con sensor de alta precisión y botones personalizables para un control preciso. Diseñado para un rendimiento avanzado en los juegos, el G502 HERO cuenta con el sensor HERO 25K, LIGHTSYNC RGB, perfiles integrados y pesos reposicionables.',
        precio: 49990,
        stock: 30,
        stockCritico: 10,
        categoria: 'accesorios',
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_657872-MLU70840166924_082023-O.webp',
        features: [
            'Sensor HERO 25K con seguimiento de precisión de hasta 25.600 dpi.',
            '11 botones programables y rueda con dos modos (desplazamiento superrápido).',
            'Peso ajustable: incluye cinco pesas reposicionables de 3,6 g.',
            'Tecnología LIGHTSYNC para iluminación RGB totalmente personalizable.',
            'Memoria integrada para guardar hasta 5 perfiles de configuración.'
        ],
        specifications: {
            "Dimensiones Físicas": {
                "Altura": "132 mm",
                "Ancho": "75 mm",
                "Profundidad": "40 mm",
                "Peso": "121 g (sólo mouse)",
                "Pesos adicionales": "hasta 18 g (5 x 3.6 g)",
                "Longitud del cable": "2,1 m"
            },
            "Seguimiento": {
                "Sensor": "HERO™ 25K",
                "Resolución": "100 – 25.600 dpi",
                "Aceleración máx.": "> 40 G",
                "Velocidad máx.": "> 400 IPS"
            },
            "Respuesta": {
                "Formato de datos USB": "16 bits/eje",
                "Velocidad de respuesta USB": "1000 Hz (1 ms)",
                "Microprocesador": "ARM de 32 bits"
            },
            "Durabilidad": {
                "Botones principales": "50 millones de clics",
                "Pies de PTFE": "> 250 km"
            },
            "Requisitos": {
                "Sistema operativo": "Windows 7+, macOS 10.11+, Chrome OS"
            }
        }
    },
    {
        codigo: 'MP001',
        nombre: 'Mousepad Razer Goliathus',
        descripcion: 'Área de juego amplia con iluminación RGB personalizable y superficie suave. Optimizado para todos los sensores y sensibilidades, ofrece una respuesta de seguimiento total.',
        precio: 29990,
        stock: 18,
        stockCritico: 5,
        categoria: 'accesorios',
        imagen: 'https://assets2.razerzone.com/images/pnx.assets/b761ba62aece1bcec7a7d9c998177cb9/razer-goliathus-chroma-3xl-ogimage_1200x630.webp',
        features: [
            "Superficie de tela microtexturizada.",
            "Iluminación Razer Chroma™ con 16.8 millones de opciones de color.",
            "Equilibrado para velocidad y control.",
            "Base de goma antideslizante.",
            "Captura de cable (en versión Chroma)."
        ],
        specifications: {
            "Dimensiones (Estándar Chroma)": {
                "Largo": "355 mm",
                "Ancho": "255 mm",
                "Altura": "3 mm",
                "Peso (aprox)": "230 g"
            },
            "Dimensiones (Extended Chroma)": {
                "Largo": "920 mm",
                "Ancho": "294 mm",
                "Altura": "3 mm"
            },
            "Características": {
                "Superficie": "Tela microtexturizada",
                "Base": "Goma antideslizante",
                "Iluminación": "Razer Chroma™ RGB"
            }
        }
    },
    {
        codigo: 'PP001',
        nombre: 'Polera Gamer Personalizada',
        descripcion: 'Camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o el logo de tu equipo favorito. Hecha de algodón de alta calidad para largas sesiones de juego.',
        precio: 14990,
        stock: 50,
        stockCritico: 10,
        categoria: 'accesorios',
        imagen: 'https://i.imgur.com/yX3aL8p.jpeg',
        features: [
            "Algodón 100% de alta densidad.",
            "Corte moderno y cómodo.",
            "Estampado de alta durabilidad (DTG o vinilo).",
            "Personalizable (consultar opciones)."
        ],
        specifications: {
            "Material": {
                "Tela": "100% Algodón peinado",
                "Peso de tela": "180 g/m²"
            },
            "Cuidados": {
                "Lavado": "Lavar con agua fría, al reverso",
                "Secado": "No usar secadora",
                "Planchado": "No planchar sobre el estampado"
            }
        }
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