import { describe, it, expect } from 'vitest';
import { validateEmail, validateRut, validatePhone, validateBirthdate } from '../../src/utils/validation';

describe('validateEmail', () => {
    it('debe devolver true para correos válidos', () => {
        expect(validateEmail('test@gmail.com')).toBe(true);
        expect(validateEmail('test@duoc.cl')).toBe(true);
        expect(validateEmail('test@profesor.duoc.cl')).toBe(true);
        expect(validateEmail('test@admin.cl')).toBe(true);
    });

    it('debe devolver false para correos inválidos', () => {
        expect(validateEmail('test@hotmail.com')).toBe(false);
        expect(validateEmail('test@gmail')).toBe(false);
        expect(validateEmail('test@.cl')).toBe(false);
        expect(validateEmail('testgmail.com')).toBe(false);
        expect(validateEmail(null)).toBe(false);
    });
});

describe('validateRut', () => {
    it('debe devolver true para RUTs válidos', () => {
        expect(validateRut('12345678-9')).toBe(true);
        expect(validateRut('19876543-K')).toBe(true);
        expect(validateRut('1.234.567-8')).toBe(true);
    });

    it('debe devolver false para RUTs inválidos', () => {
        expect(validateRut('12345678-K')).toBe(false);
        expect(validateRut('1-9')).toBe(true);
        expect(validateRut('11111111-1')).toBe(false);
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