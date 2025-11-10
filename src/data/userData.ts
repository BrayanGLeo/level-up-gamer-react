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
}

export interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'Administrador' | 'Cliente' | 'Vendedor';
    rut: string;
    registeredAt?: string;
    emailHistory: string[];
    isOriginalAdmin: boolean;
    addresses: Address[];
    orders: Order[];
    profilePic?: string;
}

export interface RegisterData {
    name: string;
    surname: string;
    email: string;
    password: string;
    rut: string;
    birthdate: string;
}

const USERS_KEY = 'users';

const getInitialUsers = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers) as User[];
        }
        const adminUser: User = {
            name: 'Admin',
            surname: 'LevelUp',
            email: 'admin@admin.cl',
            password: 'admin',
            role: 'Administrador',
            rut: '12345678-9',
            registeredAt: new Date().toLocaleDateString('es-CL'),
            emailHistory: ['admin@admin.cl'],
            isOriginalAdmin: true,
            addresses: [
                {
                    id: 1,
                    alias: 'Casa (Ejemplo SP Digital)',
                    region: 'Biobío',
                    comuna: 'Hualpén',
                    calle: 'Pasaje Greenlandia',
                    numero: '#2457',
                    depto: '',
                    recibeNombre: 'Brayan',
                    recibeApellido: 'Godoy',
                    recibeTelefono: '+56978979900'
                }
            ],
            orders: []
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
        return [adminUser];
    } catch (error) {
        console.error("Error initializing users", error);
        return [];
    }
};

export const findUser = (email: string, password: string): User | undefined => {
    let users = getInitialUsers();
    return users.find(u => u.email === email && u.password === password);
};

export const findUserByEmail = (email: string): User | undefined => {
    let users = getInitialUsers();
    return users.find(u => u.email === email);
};

export const findUserByRut = (rut: string): User | undefined => {
    let users = getInitialUsers();
    return users.find(u => u.rut === rut);
};

export const getUsers = (): User[] => {
    return getInitialUsers();
}

export const registerUser = (newUser: RegisterData): User => {
    if (findUserByEmail(newUser.email)) {
        throw new Error('Este correo electrónico ya está registrado.');
    }
    if (findUserByRut(newUser.rut)) {
        throw new Error('Este RUT ya está registrado.');
    }

    let users = getInitialUsers();
    const isAdmin = newUser.email.endsWith('@admin.cl');

    const userToSave: User = {
        ...newUser,
        role: isAdmin ? 'Administrador' : 'Cliente',
        registeredAt: new Date().toLocaleDateString('es-CL'),
        isOriginalAdmin: isAdmin,
        emailHistory: [newUser.email],
        addresses: [],
        orders: []
    };

    users.push(userToSave);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return userToSave;
};

export const saveUser = (user: User): User => {
    let users = getInitialUsers();
    const index = users.findIndex(u => u.rut === user.rut);

    if (index > -1) {
        const existingAddresses = users[index].addresses || [];
        const existingOrders = users[index].orders || [];
        const existingHistory = users[index].emailHistory || [users[index].email];
        
        const existingPic = users[index].profilePic || undefined;

        const isOriginalAdmin = users[index].isOriginalAdmin || false;
        const registeredAt = users[index].registeredAt || new Date().toLocaleDateString('es-CL');

        users[index] = {
            ...user,
            addresses: existingAddresses,
            orders: existingOrders,
            emailHistory: existingHistory,
            profilePic: existingPic,
            isOriginalAdmin: isOriginalAdmin,
            registeredAt: registeredAt
        };
    } else {
        const isAdmin = user.email.endsWith('@admin.cl');
        users.push({
            ...user,
            registeredAt: new Date().toLocaleDateString('es-CL'),
            isOriginalAdmin: isAdmin,
            emailHistory: [user.email],
            addresses: [],
            orders: []
        });
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null;
    if (currentUser && currentUser.rut === user.rut) {
        localStorage.setItem('currentUser', JSON.stringify(users[index > -1 ? index : users.length - 1]));
    }

    return users[index > -1 ? index : users.length - 1];
}

export const updateUserEmail = (rut: string, newEmail: string): User => {
    const existingUser = findUserByEmail(newEmail);

    if (existingUser && existingUser.rut !== rut) {
        throw new Error('El nuevo correo electrónico ya está en uso por otro usuario.');
    }

    let users = getInitialUsers();
    const index = users.findIndex(u => u.rut === rut);

    if (index > -1) {
        const user = users[index];
        const newEmailIsAdmin = newEmail.endsWith('@admin.cl');

        if (!user.isOriginalAdmin && newEmailIsAdmin) {
            throw new Error('No tienes permisos para asignar un dominio de administrador.');
        }

        if (user.isOriginalAdmin && newEmailIsAdmin) {
            user.role = 'Administrador';
        } else {
            user.role = 'Cliente';
        }

        if (!user.emailHistory) {
            user.emailHistory = [];
        }
        if (user.email && !user.emailHistory.includes(user.email)) {
            user.emailHistory.push(user.email);
        }

        user.email = newEmail;

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null;
        if (currentUser && currentUser.rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
    }
    throw new Error('No se encontró al usuario para actualizar el correo.');
};

export const deleteUserByRut = (rut: string): boolean => {
    let users = getInitialUsers();
    users = users.filter(u => u.rut !== rut);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
}

export const addAddress = (rut: string, newAddress: Omit<Address, 'id'>): User | null => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);
    if (userIndex > -1) {
        if (!users[userIndex].addresses) {
            users[userIndex].addresses = [];
        }
        
        const addressWithId: Address = {
            ...newAddress,
            id: Date.now()
        };

        users[userIndex].addresses.push(addressWithId);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser') || 'null').rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};

export const updateAddress = (rut: string, updatedAddress: Address): User | null => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);

    if (userIndex > -1) {
        if (!users[userIndex].addresses) {
            users[userIndex].addresses = [];
        }
        
        const addressIndex = users[userIndex].addresses.findIndex(addr => addr.id === updatedAddress.id);
        
        if (addressIndex > -1) {
            users[userIndex].addresses[addressIndex] = updatedAddress;

            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null;
            if (currentUser && currentUser.rut === rut) {
                localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            }
            return users[userIndex];
        }
    }
    return null;
};

export const deleteAddress = (rut: string, addressId: number): User | null => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);
    if (userIndex > -1 && users[userIndex].addresses) {
        users[userIndex].addresses = users[userIndex].addresses.filter(addr => addr.id !== addressId);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser') || 'null').rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};

export const addOrderToUser = (rut: string, newOrder: Order): User | null => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);
    if (userIndex > -1) {
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(newOrder);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser') || 'null').rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};