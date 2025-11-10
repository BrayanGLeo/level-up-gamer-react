import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../../src/pages/store/RegisterPage';
import { useAuth } from '../../../src/context/AuthContext';
import * as validationUtils from '../../../src/utils/validation';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
    Link: (props) => <a href={props.to} {...props}>{props.children}</a>
}));

jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));
const mockUseAuth = useAuth;

jest.mock('../../utils/validation', () => ({
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateTextField: jest.fn(),
    validateRut: jest.fn(),
    validateBirthdate: jest.fn(),
}));

describe('RegisterPage', () => {
    let mockRegister;

    beforeEach(() => {
        mockedNavigate.mockClear();
        mockRegister = jest.fn();
        mockUseAuth.mockReturnValue({ register: mockRegister });

        validationUtils.validateEmail.mockReturnValue(true);
        validationUtils.validatePassword.mockReturnValue(true);
        validationUtils.validateTextField.mockReturnValue(true);
        validationUtils.validateRut.mockReturnValue(true);
        validationUtils.validateBirthdate.mockReturnValue(true);
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
        render(<BrowserRouter><RegisterPage /></BrowserRouter>);
        expect(screen.getByText('Crear una Cuenta')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    });

    test('muestra errores de validación si los campos son inválidos', async () => {
        validationUtils.validateTextField.mockReturnValue(false);
        validationUtils.validateRut.mockReturnValue(false);

        render(<BrowserRouter><RegisterPage /></BrowserRouter>);

        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText('El nombre solo debe contener letras y espacios (máx 30 caracteres).')).toBeInTheDocument();
            expect(screen.getByText('El RUT no es válido (ej: 12345678-9).')).toBeInTheDocument();
        });
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('llama a register y muestra modal de éxito al enviar formulario válido', async () => {
        mockRegister.mockReturnValue({ success: true, message: '¡Registro Exitoso!' });
        render(<BrowserRouter><RegisterPage /></BrowserRouter>);

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {

            expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@gmail.com',
                rut: '12345678-9',
            }));
            expect(screen.getByText('¡Registro Exitoso!')).toBeInTheDocument();
        });
    });

    test('muestra modal de error si el registro falla (ej. email duplicado)', async () => {
        mockRegister.mockReturnValue({ success: false, message: 'Este correo ya está en uso.' });
        render(<BrowserRouter><RegisterPage /></BrowserRouter>);

        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

        await waitFor(() => {
            expect(screen.getByText('Error de Registro')).toBeInTheDocument();
            expect(screen.getByText('Este correo ya está en uso.')).toBeInTheDocument();
            expect(mockedNavigate).not.toHaveBeenCalled();
        });
    });
});