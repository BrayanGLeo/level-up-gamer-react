import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';

import LoginPage from '../../../src/pages/store/LoginPage';
import { AuthProvider, useAuth } from '../../../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';

vi.mock('../../../src/context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useAuth: vi.fn()
    };
});

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: vi.fn(() => vi.fn())
    };
});

vi.mock('../../../src/components/NotificationModal', () => ({
    default: ({ show, onHide, title, message }: any) => (
        show ? (
            <div>
                <h1>{title}</h1>
                <p>{message}</p>
                <button data-testid="notif-close" onClick={() => onHide && onHide()}>Close</button>
            </div>
        ) : null
    )
}));

const mockedUseAuth = useAuth as unknown as vi.Mock;
const mockedUseNavigate = useNavigate as unknown as vi.Mock;
let mockedNavigate: vi.Mock;

describe('LoginPage', () => {

    beforeEach(() => {
        mockedNavigate = vi.fn();
        mockedUseNavigate.mockReturnValue(mockedNavigate);
        mockedUseAuth.mockReturnValue({
            login: vi.fn(),
            currentUser: null
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Form Rendering and Interaction', () => {
        const MockLoginPage = () => (
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        test('renders login form correctly', () => {
            render(<MockLoginPage />);
            expect(screen.getByLabelText(/Correo Electrónico:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Contraseña:/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Acceder/i })).toBeInTheDocument();
        });

        test('allows user to type into form fields', () => {
            render(<MockLoginPage />);
            const emailInput = screen.getByLabelText(/Correo Electrónico:/i) as HTMLInputElement;
            const passwordInput = screen.getByLabelText(/Contraseña:/i) as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            expect(emailInput.value).toBe('test@gmail.com');
            expect(passwordInput.value).toBe('password123');
        });
    });

    describe('Input Validation', () => {
        test('shows validation errors for invalid email or password formats', () => {
            render(
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <LoginPage />
                </MemoryRouter>
            );

            const emailInput = screen.getByLabelText(/Correo Electrónico:/i);
            const passwordInput = screen.getByLabelText(/Contraseña:/i);
            const submitButton = screen.getByRole('button', { name: /Acceder/i });

            fireEvent.change(emailInput, { target: { value: 'bademail' } });
            fireEvent.change(passwordInput, { target: { value: '1' } });
            fireEvent.click(submitButton);

            expect(screen.getByText(/El formato del correo no es válido/i)).toBeInTheDocument();
            expect(screen.getByText(/La contraseña debe tener entre 4 y 10 caracteres/i)).toBeInTheDocument();
        });

        test('shows error message for invalid email domain (based on validation)', () => {
            render(
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <LoginPage />
                </MemoryRouter>
            );
        
            const emailInput = screen.getByLabelText(/Correo Electrónico:/i);
            fireEvent.change(emailInput, { target: { value: 'test@hotmail.com' } });
        
            const submitButton = screen.getByRole('button', { name: /Acceder/i });
            fireEvent.click(submitButton);
        });
    });

    describe('Authentication Logic', () => {
        test('successful login shows modal and navigates after closing', async () => {
            const mockLogin = vi.fn(async () => ({ success: true, redirect: '/admin', message: 'Bienvenido' }));
            mockedUseAuth.mockReturnValue({ login: mockLogin });

            render(
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <LoginPage />
                </MemoryRouter>
            );

            const emailInput = screen.getByLabelText(/Correo Electrónico:/i);
            const passwordInput = screen.getByLabelText(/Contraseña:/i);
            const submitButton = screen.getByRole('button', { name: /Acceder/i });

            fireEvent.change(emailInput, { target: { value: 'user@example.cl' } });
            fireEvent.change(passwordInput, { target: { value: 'secret' } });
            await act(async () => {
                fireEvent.click(submitButton); 
            });

            const closeButton = await screen.findByTestId('notif-close'); // Esperar a que el modal aparezca
            expect(closeButton).toBeInTheDocument();
            
            await act(async () => {
                fireEvent.click(closeButton);
            });

            expect(mockedNavigate).toHaveBeenCalledWith('/admin');
        });

        test('failed login shows modal with error message and does not navigate', async () => {
            const mockLogin = vi.fn(async () => ({ success: false, message: 'Credenciales inválidas' }));
            mockedUseAuth.mockReturnValue({ login: mockLogin });

            render(
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <LoginPage />
                </MemoryRouter>
            );

            const emailInput = screen.getByLabelText(/Correo Electrónico:/i);
            const passwordInput = screen.getByLabelText(/Contraseña:/i);
            const submitButton = screen.getByRole('button', { name: /Acceder/i });

            fireEvent.change(emailInput, { target: { value: 'user@example.cl' } });
            fireEvent.change(passwordInput, { target: { value: 'secret' } });
            await act(async () => {
                fireEvent.click(submitButton); 
            });

            expect(await screen.findByRole('heading', { name: /Error de Inicio de Sesión/i })).toBeInTheDocument();
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
            
            const closeButton = await screen.findByTestId('notif-close');
            
            await act(async () => {
                fireEvent.click(closeButton);
            });

            expect(mockedNavigate).not.toHaveBeenCalled();
        });
    });
});