const USERS_KEY = 'users';

const getInitialUsers = () => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
        const adminUser = {
            name: 'Admin',
            surname: 'LevelUp',
            email: 'admin@admin.cl',
            password: 'admin',
            role: 'Administrador',
            rut: '12345678-9',
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

let users = getInitialUsers();

export const findUser = (email, password) => {
    return users.find(u => u.email === email && u.password === password);
};

export const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};


export const registerUser = (newUser) => {
    if (findUserByEmail(newUser.email)) {
        throw new Error('Este correo electrónico ya está registrado.');
    }

    const userToSave = {
        ...newUser,
        role: newUser.email.endsWith('@admin.cl') ? 'Administrador' : 'Cliente',
        addresses: [],
        orders: []
    };

    users.push(userToSave);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return userToSave;
};

export const getUsers = () => {
    return users;
}

export const saveUser = (user) => {
    let users = getInitialUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index > -1) {
        const existingAddresses = users[index].addresses || [];
        const existingOrders = users[index].orders || [];
        users[index] = { ...users[index], ...user, addresses: existingAddresses, orders: existingOrders };
    } else {
        users.push({ ...user, addresses: [], orders: [] });
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
}

export const deleteUserByEmail = (email) => {
    users = users.filter(u => u.email !== email);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
}

export const addAddress = (email, newAddress) => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
        if (!users[userIndex].addresses) {
            users[userIndex].addresses = [];
        }
        newAddress.id = Date.now();
        users[userIndex].addresses.push(newAddress);
        
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser')).email === email) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};

export const deleteAddress = (email, addressId) => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1 && users[userIndex].addresses) {
        users[userIndex].addresses = users[userIndex].addresses.filter(addr => addr.id !== addressId);
        
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser')).email === email) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};

export const addOrderToUser = (email, newOrder) => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(newOrder);
        
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser')).email === email) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};