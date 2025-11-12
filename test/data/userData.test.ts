import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
    getUsers,
    findUser,
    findUserByEmail,
    findUserByRut,
    registerUser,
    saveUser,
    updateUserEmail,
    deleteUserByRut,
    addAddress,
    updateAddress,
    deleteAddress,
    addOrderToUser,
    updateOrderStatus,
    User,
    RegisterData,
    Address,
    Order
} from '../../src/data/userData';

const USERS_KEY = 'users';

const mockRegisterData: RegisterData = {
    name: 'Test',
    surname: 'User',
    email: 'test@gmail.com',
    password: 'password123',
    rut: '98765432-1',
    birthdate: '2000-01-01'
};

const mockAddress: Omit<Address, 'id'> = {
    alias: 'Casa',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    calle: 'Calle Falsa',
    numero: '123',
    depto: '',
    recibeNombre: 'Test',
    recibeApellido: 'User',
    recibeTelefono: '912345678'
};

const mockOrderData: Omit<Order, 'number' | 'date' | 'status'> = {
    items: [{ codigo: 'P001', nombre: 'Juego 1', quantity: 1, precio: 10000 }],
    total: 10000,
    customer: {
        name: 'Test',
        surname: 'User',
        email: 'test@gmail.com',
        phone: '912345678'
    },
    shipping: {
        type: 'Retiro en Tienda'
    }
};

describe('userData', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('getUsers debe inicializar con admin y vendedor si localStorage está vacío', () => {
        const users = getUsers();
        expect(users).toHaveLength(2);
        expect(users[0].email).toBe('admin@admin.cl');
        expect(users[0].isOriginalAdmin).toBe(true);
        expect(users[1].email).toBe('vendedor@vendedor.cl');
    });

    test('findUser debe encontrar al admin por email y password', () => {
        const user = findUser('admin@admin.cl', 'admin');
        expect(user).toBeDefined();
        expect(user?.name).toBe('Admin');
    });

    test('findUser debe fallar con contraseña incorrecta', () => {
        const user = findUser('admin@admin.cl', 'wrongpass');
        expect(user).toBeUndefined();
    });

    test('findUserByEmail y findUserByRut deben encontrar al admin', () => {
        const userByEmail = findUserByEmail('admin@admin.cl');
        const userByRut = findUserByRut('12345678-9');
        expect(userByEmail).toBeDefined();
        expect(userByRut).toBeDefined();
        expect(userByEmail?.rut).toBe(userByRut?.rut);
    });



    test('registerUser debe crear un nuevo usuario "Cliente"', () => {
        const newUser = registerUser(mockRegisterData);
        expect(newUser.email).toBe('test@gmail.com');
        expect(newUser.role).toBe('Cliente');

        const users = getUsers();
        expect(users).toHaveLength(3);

        const foundUser = findUserByEmail('test@gmail.com');
        expect(foundUser?.name).toBe('Test');
    });

    test('registerUser debe lanzar error por email duplicado', () => {
        registerUser(mockRegisterData);

        const duplicateEmailData = { ...mockRegisterData, rut: '22222222-2' };
        expect(() => registerUser(duplicateEmailData))
            .toThrow('Este correo electrónico ya está registrado.');
    });

    test('registerUser debe lanzar error por RUT duplicado', () => {
        registerUser(mockRegisterData);

        const duplicateRutData = { ...mockRegisterData, email: 'test2@gmail.com' };
        expect(() => registerUser(duplicateRutData))
            .toThrow('Este RUT ya está registrado.');
    });

    test('saveUser debe actualizar los datos de un usuario', () => {
        const newUser = registerUser(mockRegisterData);

        const updatedData = { ...newUser, name: 'Nombre Actualizado' };
        saveUser(updatedData);

        const users = getUsers();
        expect(users).toHaveLength(3);

        const foundUser = findUserByRut('98765432-1');
        expect(foundUser?.name).toBe('Nombre Actualizado');
    });

    test('updateUserEmail debe cambiar el email y registrarlo en el historial', () => {
        registerUser(mockRegisterData);

        const updatedUser = updateUserEmail('98765432-1', 'nuevo@gmail.com');

        expect(updatedUser.email).toBe('nuevo@gmail.com');
        expect(updatedUser.emailHistory).toContain('test@gmail.com');
        expect(updatedUser.emailHistory).toContain('nuevo@gmail.com');
        expect(updatedUser.emailHistory).toHaveLength(2);
    });

    test('updateUserEmail debe lanzar error si el nuevo email ya está en uso', () => {
        registerUser(mockRegisterData);
        expect(() => updateUserEmail('98765432-1', 'admin@admin.cl'))
            .toThrow('El nuevo correo electrónico ya está en uso por otro usuario.');
    });

    test('deleteUserByRut debe eliminar un usuario', () => {
        registerUser(mockRegisterData);
        let users = getUsers();
        expect(users).toHaveLength(3);

        deleteUserByRut('98765432-1');

        users = getUsers();
        expect(users).toHaveLength(2);
        expect(findUserByRut('98765432-1')).toBeUndefined();
    });

    test('addAddress debe agregar una dirección al usuario', () => {
        const user = registerUser(mockRegisterData);
        const updatedUser = addAddress(user.rut, mockAddress);

        expect(updatedUser?.addresses).toHaveLength(1);
        expect(updatedUser?.addresses[0].alias).toBe('Casa');
        expect(updatedUser?.addresses[0].id).toBeTypeOf('number');
    });

    test('updateAddress debe modificar una dirección existente', () => {
        let user: User | null = registerUser(mockRegisterData);
        user = addAddress(user.rut, mockAddress);

        const addressToUpdate = { ...user!.addresses[0], alias: 'Oficina' };
        user = updateAddress(user!.rut, addressToUpdate);

        expect(user?.addresses).toHaveLength(1);
        expect(user?.addresses[0].alias).toBe('Oficina');
    });

    test('deleteAddress debe eliminar una dirección', () => {
        let user: User | null = registerUser(mockRegisterData);
        user = addAddress(user.rut, mockAddress);

        const addressId = user!.addresses[0].id;
        user = deleteAddress(user!.rut, addressId);

        expect(user?.addresses).toHaveLength(0);
    });

    test('addOrderToUser debe agregar un pedido y asignar estado "Pendiente"', () => {
        let user = registerUser(mockRegisterData);

        const orderData = {
            ...mockOrderData,
            number: 12345,
            date: new Date().toLocaleDateString('es-CL'),
        } as Order;

        user = addOrderToUser(user.rut, orderData)!;
        expect(user.orders).toHaveLength(1);
        expect(user.orders[0].number).toBe(12345);
        expect(user.orders[0].status).toBe('Pendiente');
    });

    test('updateOrderStatus debe cambiar el estado de un pedido', () => {
        let user = registerUser(mockRegisterData);
        const orderData = {
            ...mockOrderData,
            number: 12345,
            date: new Date().toLocaleDateString('es-CL'),
        } as Order;

        user = addOrderToUser(user.rut, orderData)!;
        user = updateOrderStatus(user.rut, 12345, 'Completado')!;

        expect(user.orders[0].status).toBe('Completado');
    });

});