vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
        Link: (props: any) => <a href={props.to} {...props}>{props.children}</a>
    };
});
vi.mock('../../../src/context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

vi.mock('../../../src/utils/validation', () => ({
    validateRegisterEmail: vi.fn(),
    validatePassword: vi.fn(),
    validateTextField: vi.fn(),
    validateRut: vi.fn(),
    validateBirthdate: vi.fn(),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../../src/pages/store/RegisterPage';
import { useAuth, AuthContextType } from '../../../src/context/AuthContext';
import * as validationUtils from '../../../src/utils/validation';

const mockedNavigate = vi.fn();
const mockUseAuth = useAuth as vi.Mock;
const mockValidateEmail = validationUtils.validateRegisterEmail as vi.Mock;
const mockValidatePassword = validationUtils.validatePassword as vi.Mock;
const mockValidateTextField = validationUtils.validateTextField as vi.Mock;
const mockValidateRut = validationUtils.validateRut as vi.Mock;
const mockValidateBirthdate = validationUtils.validateBirthdate as vi.Mock;


describe('RegisterPage', () => {
    let mockRegister: vi.Mock;

    beforeEach(() => {
        mockedNavigate.mockClear();
        mockRegister = vi.fn();
        mockUseAuth.mockReturnValue({ register: mockRegister } as Partial<AuthContextType>);
        mockValidateEmail.mockReturnValue(true);
        mockValidatePassword.mockReturnValue(true);
        mockValidateTextField.mockReturnValue(true);
        mockValidateRut.mockReturnValue(true);
        mockValidateBirthdate.mockReturnValue(true);
    });

    const fillForm = () => {
        fireEvent.change(screen.getByLabelText(/Nombres:/i), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText(/Apellidos:/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { value: '12345678-9' } });
        fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento:/i), { target: { value: '2000-01-01' } });
        fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'password123' } });
    };

    test('renderiza el formulario de registro', () => {
        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);
        expect(screen.getByText('Crear una Cuenta')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    });

    test('muestra errores de validación si los campos son inválidos', async () => {
        mockValidateTextField.mockReturnValue(false);
        mockValidateRut.mockReturnValue(false);

        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);  

        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        expect(await screen.findByText('El nombre solo debe contener letras y espacios (máx 30 caracteres).')).toBeInTheDocument();
        expect(await screen.findByText('El RUT no es válido (ej: 12345678-9).')).toBeInTheDocument();
        
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('muestra error si el correo es inválido', async () => {
        mockValidateEmail.mockReturnValue(false);

        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        expect(await screen.findByText('Correo inválido. Dominios permitidos: gmail, duoc.')).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('muestra error si las contraseñas no coinciden', async () => {
        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);

        fireEvent.change(screen.getByLabelText(/Nombres:/i), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText(/Apellidos:/i), { target: { value: 'User' } });
        fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { value: '12345678-9' } });
        fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento:/i), { target: { value: '2000-01-01' } });
        fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'password456' } });

        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        expect(await screen.findByText('Las contraseñas no coinciden.')).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('llama a register y muestra modal de éxito al enviar formulario válido', async () => {
        mockRegister.mockReturnValue({ success: true, message: '¡Bienvenido! Tu cuenta ha sido creada.' });
        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        const modalElements = await screen.findAllByText('¡Registro Exitoso!');
        
        expect(modalElements.length).toBeGreaterThan(0);

        expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
            email: 'test@gmail.com',
            rut: '12345678-9',
        }));
        
        expect(await screen.findByText('¡Bienvenido! Tu cuenta ha sido creada.')).toBeInTheDocument();
    });

    test('muestra modal de error si el registro falla (ej. email duplicado)', async () => {
        mockRegister.mockReturnValue({ success: false, message: 'Este correo ya está en uso.' });
        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        expect(await screen.findByText('Error de Registro')).toBeInTheDocument();
        expect(await screen.findByText('Este correo ya está en uso.')).toBeInTheDocument();
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    test('navega a store cuando cierra modal después de registro exitoso', async () => {
        mockRegister.mockReturnValue({ success: true, message: '¡Bienvenido! Tu cuenta ha sido creada.', redirect: '/store' });
        render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><RegisterPage /></BrowserRouter>);

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await screen.findByText('¡Bienvenido! Tu cuenta ha sido creada.');

        const closeButtons = screen.getAllByRole('button');
        const acceptButton = closeButtons.find((btn) => btn.textContent === 'Aceptar' || btn.getAttribute('aria-label')?.includes('close'));
        
        if (acceptButton) {
            fireEvent.click(acceptButton);
            expect(mockedNavigate).toHaveBeenCalledWith('/store');
        }
    });
});