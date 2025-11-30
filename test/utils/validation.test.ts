import { describe, it, expect } from 'vitest';
import {
    validateRegisterEmail,
    validateRut,
    validatePhone,
    validateBirthdate,
    validateBasicEmail,
    validatePassword,
    validateLoginPassword,
    validateRequiredField,
    validateTextField,
    validateProductForm,
    validateUserForm
} from '../../src/utils/validation';

describe('Validation Utilities', () => {

    describe('validateBasicEmail', () => {
        it('should return true for valid email formats', () => {
            expect(validateBasicEmail('user@example.com')).toBe(true);
            expect(validateBasicEmail('test.user@domain.co.uk')).toBe(true);
        });

        it('should return false for invalid email formats', () => {
            expect(validateBasicEmail('invalid-email')).toBe(false);
            expect(validateBasicEmail('user@')).toBe(false);
            expect(validateBasicEmail('@domain.com')).toBe(false);
            expect(validateBasicEmail(null)).toBe(false);
        });
    });

    describe('validateRegisterEmail', () => {
        it('should return true for allowed registration domains', () => {
            expect(validateRegisterEmail('test@gmail.com')).toBe(true);
            expect(validateRegisterEmail('test@duoc.cl')).toBe(true);
            expect(validateRegisterEmail('test@duocuc.cl')).toBe(true);
        });

        it('should return false for disallowed registration domains', () => {
            expect(validateRegisterEmail('test@hotmail.com')).toBe(false);
            expect(validateRegisterEmail('test@profesor.duoc.cl')).toBe(false);
            expect(validateRegisterEmail('test@other.com')).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should return true for passwords of valid length (registration)', () => {
            expect(validatePassword('123456')).toBe(true);
            expect(validatePassword('abcdef')).toBe(true);
        });

        it('should return false for passwords of invalid length (registration)', () => {
            expect(validatePassword('12345')).toBe(false);
        });
    });

    describe('validateLoginPassword', () => {
        it('should return true for passwords of valid length (login)', () => {
            expect(validateLoginPassword('1234')).toBe(true);
            expect(validateLoginPassword('1234567890')).toBe(true);
        });

        it('should return false for passwords of invalid length (login)', () => {
            expect(validateLoginPassword('123')).toBe(false);
            expect(validateLoginPassword('12345678901')).toBe(false);
        });
    });

    describe('validateRequiredField', () => {
        it('should return true for non-empty strings within max length', () => {
            expect(validateRequiredField('OK', 10)).toBe(true);
            expect(validateRequiredField('  Leading/Trailing Spaces  ', 30)).toBe(true);
        });

        it('should return false for empty or excessively long strings', () => {
            expect(validateRequiredField('', 10)).toBe(false);
            expect(validateRequiredField('   ', 10)).toBe(false);
            expect(validateRequiredField('this string is too long', 10)).toBe(false);
        });
    });

    describe('validateTextField', () => {
        it('should return true for valid text fields (letters and spaces)', () => {
            expect(validateTextField('Nombre Apellido', 30)).toBe(true);
            expect(validateTextField('SingleName', 20)).toBe(true);
        });

        it('should return false for text fields with numbers or special characters', () => {
            expect(validateTextField('Nombre123', 30)).toBe(false);
            expect(validateTextField('Invalid!', 20)).toBe(false);
        });
    });

    describe('validateRut', () => {
        it('should return true for valid RUTs with correct DV', () => {
            expect(validateRut('19.876.543-0')).toBe(true);
            expect(validateRut('1-9')).toBe(true);
            expect(validateRut('12.345.678-5')).toBe(true); // DV normal (not 0 or K)
        });

        it('should return false for invalid RUTs or incorrect DV', () => {
            expect(validateRut('12.345.678-9')).toBe(false);
            expect(validateRut('11.111.111-1')).toBe(false);
            expect(validateRut('12345')).toBe(false);
        });

        it('should return true for RUTs with DV 11 (expecting 0)', () => {
            // Testing the dvEsperado === 11 branch
            // Calculate a valid RUT where DV should be 0 (when 11-remainder = 11)
            const body = '11305441'; // Body where sum mod 11 = 0
            let suma = 0;
            let multiplo = 2;
            for (let i = body.length - 1; i >= 0; i--) {
                suma += multiplo * parseInt(body.charAt(i), 10);
                multiplo = (multiplo === 7) ? 2 : multiplo + 1;
            }
            const dv = (11 - (suma % 11)).toString().replace('11', '0').replace('10', 'K');
            const rut11 = `${body.slice(0, 2)}.${body.slice(2, 5)}.${body.slice(5)}-${dv}`;
            expect(validateRut(rut11)).toBe(true);
        });

        it('should return true for RUTs with DV 10 (expecting K)', () => {
            // Testing the dvEsperado === 10 branch
            // Calculate a valid RUT where DV should be K (when 11-remainder = 10)
            const body = '10234568'; // Body where sum mod 11 = 1
            let suma = 0;
            let multiplo = 2;
            for (let i = body.length - 1; i >= 0; i--) {
                suma += multiplo * parseInt(body.charAt(i), 10);
                multiplo = (multiplo === 7) ? 2 : multiplo + 1;
            }
            const dv = (11 - (suma % 11)).toString().replace('11', '0').replace('10', 'K');
            const rutK = `${body.slice(0, 2)}.${body.slice(2, 5)}.${body.slice(5)}-${dv}`;
            expect(validateRut(rutK)).toBe(true);
        });

        it('should compute DV correctly and validate', () => {
            const body = '12345678';
            let suma = 0;
            let multiplo = 2;
            for (let i = body.length - 1; i >= 0; i--) {
                suma += multiplo * parseInt(body.charAt(i), 10);
                multiplo = (multiplo === 7) ? 2 : multiplo + 1;
            }
            const dv = (11 - (suma % 11)).toString().replace('11', '0').replace('10', 'K');
            
            const rut = `${body}-${dv}`;
            expect(validateRut(rut)).toBe(true);
        });
    });

    describe('validateBirthdate', () => {
        it('should return true for users over 18 years old', () => {
            const ofAge = '1990-01-01';
            expect(validateBirthdate(ofAge)).toBe(true);
        });

        it('should return false for users under 18 or with invalid dates', () => {
            const today = new Date();
            const underAge = `${today.getFullYear() - 10}-01-01`;
            expect(validateBirthdate(underAge)).toBe(false);
            expect(validateBirthdate('1800-01-01')).toBe(false);
        });

        it('should return true for null or empty birthdate (optional field)', () => {
            expect(validateBirthdate(null as any)).toBe(true);
            expect(validateBirthdate('')).toBe(true);
        });
    });

    describe('validatePhone', () => {
        it('should return true for valid Chilean phone numbers', () => {
            expect(validatePhone('912345678')).toBe(true);
            expect(validatePhone('+56912345678')).toBe(true);
        });
    
        it('should return false for invalid phone numbers', () => {
            expect(validatePhone('12345678')).toBe(false);
            expect(validatePhone('812345678')).toBe(false);
            expect(validatePhone('91234567')).toBe(false);
            expect(validatePhone('123')).toBe(false);
        });
    });

    describe('validateProductForm', () => {
        it('should return an empty object for a valid product form', () => {
            const validProduct = { codigo: 'P-001', nombre: 'Test Product', precio: '1000', stock: '10', categoria: 'cat1' };
            const errors = validateProductForm(validProduct);
            expect(Object.keys(errors).length).toBe(0);
        });

        it('should return an errors object for an invalid product form', () => {
            const invalidProduct = { codigo: '', nombre: '', precio: '', stock: '', categoria: null };
            const errors = validateProductForm(invalidProduct);
            expect(Object.keys(errors).length).toBeGreaterThan(0);
            expect(errors).toHaveProperty('codigo');
            expect(errors).toHaveProperty('nombre');
            expect(errors).toHaveProperty('precio');
            expect(errors).toHaveProperty('stock');
            expect(errors).toHaveProperty('categoria');
        });

        it('should validate codigo with less than 3 characters', () => {
            const product = { codigo: 'AB', nombre: 'Test', precio: '1000', stock: '10', categoria: 'cat1' };
            const errors = validateProductForm(product);
            expect(errors).toHaveProperty('codigo');
        });

        it('should validate nombre exceeding 100 characters', () => {
            const longName = 'A'.repeat(101);
            const product = { codigo: 'P-001', nombre: longName, precio: '1000', stock: '10', categoria: 'cat1' };
            const errors = validateProductForm(product);
            expect(errors).toHaveProperty('nombre');
        });

        it('should validate negative precio', () => {
            const product = { codigo: 'P-001', nombre: 'Test', precio: '-100', stock: '10', categoria: 'cat1' };
            const errors = validateProductForm(product);
            expect(errors).toHaveProperty('precio');
        });

        it('should validate non-integer or negative stock', () => {
            const product = { codigo: 'P-001', nombre: 'Test', precio: '1000', stock: '-5', categoria: 'cat1' };
            const errors = validateProductForm(product);
            expect(errors).toHaveProperty('stock');
        });
    });

    describe('validateUserForm', () => {
        it('should return an empty object for a valid user form', () => {
            const validUser: any = {
                run: '19876543-0',
                nombre: 'John',
                apellidos: 'Doe',
                email: 'john.doe@gmail.com',
                fechaNacimiento: '1990-01-01',
                direccion: '123 Main St',
                region: 'Metropolitana',
                comuna: 'Santiago',
                role: 'user'
            };
            const errors = validateUserForm(validUser);
            expect(Object.keys(errors).length).toBe(0);
        });

        it('should return an errors object for a user form with invalid data', () => {
            const invalidUser: any = {
                run: '123',
                nombre: 'John123',
                apellidos: '',
                email: 'bad-email',
                fechaNacimiento: '2022-01-01',
                direccion: '',
                region: '',
                comuna: '',
                role: ''
            };
            const errors = validateUserForm(invalidUser);
            expect(Object.keys(errors).length).toBeGreaterThan(0);
            expect(errors).toHaveProperty('run');
            expect(errors).toHaveProperty('nombre');
            expect(errors).toHaveProperty('apellidos');
            expect(errors).toHaveProperty('email');
            expect(errors).toHaveProperty('fechaNacimiento');
        });
    });
});