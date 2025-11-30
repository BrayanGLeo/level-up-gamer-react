import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
    getUsers,
    getGuestOrders,
    addGuestOrder,
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

    describe('Guest Order Functions', () => {
        const mockGuestOrder: Order = {
            number: 999,
            date: '2025-01-01',
            items: [{ id: 'G1', name: 'Guest Item', quantity: 1, precio: 50, image: '' }],
            total: 50,
            customer: { name: 'Guest', surname: 'User', email: 'guest@example.com', phone: '123' },
            shipping: { type: 'Retiro en Tienda' },
            status: 'Pendiente'
        };

        test('getGuestOrders debe devolver un array vacío si no hay pedidos', () => {
            const orders = getGuestOrders();
            expect(orders).toEqual([]);
        });

        test('addGuestOrder debe agregar un nuevo pedido de invitado', () => {
            addGuestOrder(mockGuestOrder);
            const orders = getGuestOrders();
            expect(orders).toHaveLength(1);
            expect(orders[0].number).toBe(999);
            expect(orders[0].status).toBe('Pendiente');
        });

        test('getGuestOrders debe devolver los pedidos guardados', () => {
            localStorage.setItem('orders', JSON.stringify([mockGuestOrder]));
            const orders = getGuestOrders();
            expect(orders).toHaveLength(1);
            expect(orders[0].number).toBe(999);
        });

        test('updateOrderStatus (guest) debe actualizar el estado de un pedido de invitado', () => {
            addGuestOrder(mockGuestOrder);
            const updatedUser = updateOrderStatus('invitado', 999, 'Enviado');
            expect(updatedUser).toBeNull();
            const orders = getGuestOrders();
            expect(orders[0].status).toBe('Enviado');
        });

        test('updateOrderStatus (guest) debe no hacer nada si el pedido no existe', () => {
            addGuestOrder(mockGuestOrder);
            updateOrderStatus('invitado', 111, 'Enviado');
            const orders = getGuestOrders();
            expect(orders[0].status).toBe('Pendiente');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        test('getInitialUsers debe devolver un array vacío si localStorage.getItem lanza un error', () => {
            const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation((key) => {
                if (key === 'users') throw new Error('Test Error');
                return null;
            });
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const users = getUsers();
            expect(users).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalled();
    
            getItemSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        test('getInitialUsers debe devolver un array vacío si el JSON en localStorage es inválido', () => {
            const getItemSpy = vi.spyOn(localStorage, 'getItem').mockReturnValue('invalid json');
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const users = getUsers();
            expect(users).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalled();

            getItemSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });
    
        test('getGuestOrders debe devolver un array vacío si localStorage.getItem lanza un error', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
                if (key === 'orders') throw new Error('Test Error');
                return null;
            });
            const orders = getGuestOrders();
            expect(orders).toEqual([]);
        });

        test('saveUser debe lanzar error si faltan datos para crear nuevo usuario', () => {
            const partialUser: Partial<User> = { name: 'Incompleto' };
            expect(() => saveUser(partialUser)).toThrow("Faltan datos obligatorios para crear un nuevo usuario.");
        });
        
        test('saveUser debe crear un nuevo usuario si no existe', () => {
            const newUser: Partial<User> = {
                name: 'Nuevo',
                surname: 'Usuario',
                email: 'nuevo@example.com',
                password: 'password',
                role: 'Cliente',
                rut: '11223344-5'
            };
            const savedUser = saveUser(newUser);
            expect(savedUser.name).toBe('Nuevo');
    
            const users = getUsers();
            expect(users).toHaveLength(3);
            const found = findUserByRut('11223344-5');
            expect(found).toBeDefined();
        });

        test('saveUser debe actualizar currentUser si se modifica un usuario existente', () => {
            const registered = registerUser(mockRegisterData);
            localStorage.setItem('currentUser', JSON.stringify(registered));

            const updatedData = { ...registered, name: 'Current User Updated' };
            saveUser(updatedData);

            const updatedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            expect(updatedCurrentUser.name).toBe('Current User Updated');
        });

        test('saveUser debe actualizar currentUser si el usuario creado es el mismo que el actual', () => {
            const newUser: Partial<User> = {
                name: 'Nuevo',
                surname: 'Usuario',
                email: 'nuevo@example.com',
                password: 'password',
                role: 'Cliente',
                rut: '11223344-5'
            };
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            const savedUser = saveUser(newUser);
            expect(savedUser.name).toBe('Nuevo');
    
            const updatedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            expect(updatedCurrentUser.name).toBe('Nuevo');
        });

        test('updateUserEmail debe permitir al admin original cambiar su email a otro de admin', () => {
            const adminUser = findUserByEmail('admin@admin.cl');
            const updatedUser = updateUserEmail(adminUser!.rut, 'newadmin@admin.cl');

            expect(updatedUser.email).toBe('newadmin@admin.cl');
            expect(updatedUser.role).toBe('Administrador');
        });

        test('updateUserEmail debe fallar si usuario no-admin intenta usar email de admin', () => {
            registerUser(mockRegisterData);
            expect(() => updateUserEmail(mockRegisterData.rut, 'test@admin.cl'))
                .toThrow('No tienes permisos para asignar un dominio de administrador.');
        });
        
        test('updateUserEmail debe fallar si se busca un usuario que no existe', () => {
            expect(() => updateUserEmail('000', 'email@test.com'))
                .toThrow('No se encontró al usuario para actualizar el correo.');
        });

        test('addAddress debe funcionar si el usuario no tiene la propiedad "addresses"', () => {
            let user = registerUser(mockRegisterData);
            delete (user as any).addresses;
            localStorage.setItem(USERS_KEY, JSON.stringify([user]));

            const updatedUser = addAddress(user.rut, mockAddress);
            expect(updatedUser?.addresses).toHaveLength(1);
            expect(updatedUser?.addresses[0].alias).toBe('Casa');
        });

        test('addAddress debe actualizar currentUser si se modifica', () => {
            const registered = registerUser(mockRegisterData);
            localStorage.setItem('currentUser', JSON.stringify(registered));

            addAddress(registered.rut, mockAddress);

            const updatedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            expect(updatedCurrentUser.addresses).toHaveLength(1);
        });

        test('updateAddress debe devolver null si el usuario no existe', () => {
            const result = updateAddress('000', { ...mockAddress, id: 1 });
            expect(result).toBeNull();
        });

        test('updateAddress debe funcionar si el usuario no tiene la propiedad "addresses"', () => {
            let user = registerUser(mockRegisterData);
            delete (user as any).addresses;
            localStorage.setItem(USERS_KEY, JSON.stringify([user]));

            const result = updateAddress(user.rut, { ...mockAddress, id: 1 });
            expect(result).toBeNull();
        });

        test('updateAddress debe no hacer nada si la dirección no existe', () => {
            const user = registerUser(mockRegisterData);
            const result = updateAddress(user.rut, { ...mockAddress, id: 999 });
            expect(result).toBeNull();
        });

        test('deleteAddress debe devolver null si el usuario no existe', () => {
            const result = deleteAddress('000', 1);
            expect(result).toBeNull();
        });

        test('addOrderToUser debe funcionar si el usuario no tiene la propiedad "orders"', () => {
            let user = registerUser(mockRegisterData);
            delete (user as any).orders;
            localStorage.setItem(USERS_KEY, JSON.stringify([user]));

            const order = { ...mockOrderData, number: 1, date: '' } as Order;
            const updatedUser = addOrderToUser(user.rut, order);

            expect(updatedUser?.orders).toHaveLength(1);
            expect(updatedUser?.orders[0].number).toBe(1);
        });

        test('addOrderToUser debe devolver null si el usuario no existe', () => {
            const order = { ...mockOrderData, number: 1, date: '' } as Order;
            const result = addOrderToUser('000', order);
            expect(result).toBeNull();
        });

        test('updateOrderStatus debe devolver null si el usuario no existe', () => {
            const result = updateOrderStatus('000', 123, 'Completado');
            expect(result).toBeNull();
        });

        test('updateOrderStatus debe no hacer nada si la orden no existe', () => {
            const user = registerUser(mockRegisterData);
            const result = updateOrderStatus(user.rut, 999, 'Completado');
            expect(result).toBeNull();
        });

        test('updateOrderStatus debe no hacer nada si el usuario no tiene la propiedad "orders"', () => {
            let user = registerUser(mockRegisterData);
            delete (user as any).orders;
            localStorage.setItem(USERS_KEY, JSON.stringify([user]));
            
            const result = updateOrderStatus(user.rut, 123, 'Completado');
            expect(result).toBeNull();
        });
    });
});