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