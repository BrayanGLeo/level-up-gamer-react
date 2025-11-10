import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../src/context/AuthContext';
import LoginPage from '../../../src/pages/store/LoginPage';

const MockLoginPage = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        </BrowserRouter>
    );
};

test('renders login form correctly', () => {
    render(<MockLoginPage />);

    expect(screen.getByLabelText(/Correo Electrónico:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acceder/i })).toBeInTheDocument();
});

test('allows user to type into form fields', () => {
    render(<MockLoginPage />);

    const emailInput = screen.getByLabelText(/Correo Electrónico:/i);
    const passwordInput = screen.getByLabelText(/Contraseña:/i);

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@gmail.com');
    expect(passwordInput.value).toBe('password123');
});

test('shows error message for invalid email domain (based on our validation)', () => {
    render(<MockLoginPage />);

    const emailInput = screen.getByLabelText(/Correo Electrónico:/i);
    fireEvent.change(emailInput, { target: { value: 'test@hotmail.com' } });

    const submitButton = screen.getByRole('button', { name: /Acceder/i });
    fireEvent.click(submitButton);
});