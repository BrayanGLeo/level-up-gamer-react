export interface Address {
    id: number;
    alias: string;
    region: string;
    comuna: string;
    calle: string;
    numero: string;
    depto: string;
    recibeNombre: string;
    recibeApellido: string;
    recibeTelefono: string;
}

export interface Order {
    number: number;
    date: string;
    items: any[];
    total: number;
    customer: {
        name: string;
        surname: string;
        email: string;
        phone: string;
    };
    shipping: any;
    status?: string;
}

export interface User {
    id?: number;
    name: string;
    surname: string;
    email: string;
    password?: string;
    role: 'Administrador' | 'Cliente' | 'Vendedor';
    rut: string;
    registeredAt?: string;
    emailHistory?: string[];
    isOriginalAdmin?: boolean;
    addresses?: Address[];
    orders?: Order[];
    profilePic?: string;
    birthdate?: string;
    direccion?: string;
    region?: string;
    comuna?: string;
}

export interface RegisterData {
    name: string;
    surname: string;
    email: string;
    password: string;
    rut: string;
    birthdate: string;
}