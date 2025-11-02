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
            emailHistory: ['admin@admin.cl'],
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

export const findUserByRut = (rut) => {
    return users.find(u => u.rut === rut);
};

export const registerUser = (newUser) => {
    if (findUserByEmail(newUser.email)) {
        throw new Error('Este correo electrónico ya está registrado.');
    }
    if (findUserByRut(newUser.rut)) {
        throw new Error('Este RUT ya está registrado.');
    }

    const userToSave = {
        ...newUser,
        role: newUser.email.endsWith('@admin.cl') ? 'Administrador' : 'Cliente',
        emailHistory: [newUser.email],
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
    const index = users.findIndex(u => u.rut === user.rut);
    if (index > -1) {
        const existingAddresses = users[index].addresses || [];
        const existingOrders = users[index].orders || [];
        const existingHistory = users[index].emailHistory || [users[index].email];
        const existingPic = users[index].profilePic || null;

        users[index] = {
            ...users[index],
            ...user,
            addresses: existingAddresses,
            orders: existingOrders,
            emailHistory: existingHistory,
            profilePic: existingPic
        };
    } else {
        users.push({ ...user, emailHistory: [user.email], addresses: [], orders: [] });
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.rut === user.rut) {
        localStorage.setItem('currentUser', JSON.stringify(users[index]));
    }

    return users[index] || user;
}

export const updateUserEmail = (rut, newEmail) => {
    if (findUserByEmail(newEmail)) {
        throw new Error('El nuevo correo electrónico ya está en uso por otro usuario.');
    }

    let users = getInitialUsers();
    const index = users.findIndex(u => u.rut === rut);

    if (index > -1) {
        if (!users[index].emailHistory) {
            users[index].emailHistory = [];
        }
        if (!users[index].emailHistory.includes(users[index].email)) {
            users[index].emailHistory.push(users[index].email);
        }

        users[index].email = newEmail;

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[index]));
        }

        return users[index];
    }
    throw new Error('No se encontró al usuario para actualizar el correo.');
};

export const deleteUserByRut = (rut) => {
    users = users.filter(u => u.rut !== rut);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
}

export const addAddress = (rut, newAddress) => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);
    if (userIndex > -1) {
        if (!users[userIndex].addresses) {
            users[userIndex].addresses = [];
        }
        newAddress.id = Date.now();
        users[userIndex].addresses.push(newAddress);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser')).rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};

export const deleteAddress = (rut, addressId) => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);
    if (userIndex > -1 && users[userIndex].addresses) {
        users[userIndex].addresses = users[userIndex].addresses.filter(addr => addr.id !== addressId);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser')).rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};

export const addOrderToUser = (rut, newOrder) => {
    let users = getInitialUsers();
    const userIndex = users.findIndex(u => u.rut === rut);
    if (userIndex > -1) {
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(newOrder);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        if (JSON.parse(localStorage.getItem('currentUser')).rut === rut) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        return users[userIndex];
    }
    return null;
};