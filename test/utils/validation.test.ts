import { describe, it, expect } from 'vitest';
import { validateRegisterEmail, validateRut, validatePhone, validateBirthdate } from '../../src/utils/validation';

describe('validateRegisterEmail', () => {
    it('debe devolver true para correos válidos', () => {
        expect(validateRegisterEmail('test@gmail.com')).toBe(true);
        expect(validateRegisterEmail('test@duoc.cl')).toBe(true);
        expect(validateRegisterEmail('test@duocuc.cl')).toBe(true);
        expect(validateRegisterEmail('test@gmail.cl')).toBe(true);
    });

    it('debe devolver false para correos inválidos', () => {
        expect(validateRegisterEmail('test@hotmail.com')).toBe(false);
        expect(validateRegisterEmail('test@profesor.duoc.cl')).toBe(false);
        expect(validateRegisterEmail('test@admin.cl')).toBe(false);
        expect(validateRegisterEmail('test@gmail')).toBe(false);
        expect(validateRegisterEmail('test@.cl')).toBe(false);
        expect(validateRegisterEmail('testgmail.com')).toBe(false);
        expect(validateRegisterEmail(null)).toBe(false);
    });
});

describe('validateRut', () => {
    it('debe devolver true para RUTs válidos', () => {
        expect(validateRut('1-9')).toBe(true);
        expect(validateRut('12.345.678-5')).toBe(true);
        expect(validateRut('20.123.456-5')).toBe(true);
        expect(validateRut('19.876.543-0')).toBe(true); 
    });

    it('debe devolver false para RUTs inválidos', () => {
        expect(validateRut('12.345.678-9')).toBe(false);
        expect(validateRut('19.876.543-K')).toBe(false); 
        expect(validateRut('11.111.111-1')).toBe(false); 
        expect(validateRut('12345')).toBe(false);
    });
});

describe('validatePhone', () => {
    it('debe devolver true para teléfonos válidos', () => {
        expect(validatePhone('912345678')).toBe(true);
        expect(validatePhone('+56912345678')).toBe(true);
    });
    
    it('debe devolver false para teléfonos inválidos', () => {
        expect(validatePhone('12345678')).toBe(false);
        expect(validatePhone('812345678')).toBe(false);
        expect(validatePhone('91234567')).toBe(false);
    });
});

describe('validateBirthdate', () => {
    it('debe devolver true si es mayor de 18', () => {
        const mayorDeEdad = '1990-01-01';
        expect(validateBirthdate(mayorDeEdad)).toBe(true);
    });

    it('debe devolver false si es menor de 18', () => {
        const hoy = new Date();
        const menorDeEdad = `${hoy.getFullYear() - 10}-01-01`;
        expect(validateBirthdate(menorDeEdad)).toBe(false);
    });
});