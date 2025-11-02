import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validateLoginPassword } from '../../utils/validation';
import '../../styles/Forms.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        const emailToValidate = email.trim().toLowerCase();

        if (!validateEmail(emailToValidate)) {
            newErrors.email = 'El formato del correo no es válido. (ej. @gmail.com, @duoc.cl)';
        }
        if (!validateLoginPassword(password)) {
            newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            login(emailToValidate, password);
        }
    };

    return (
        <main className="form-container">
            <section className="login-section">
                <Container>
                    <h2 className="section-title">Iniciar Sesión</h2>
                    <Form id="loginForm" onSubmit={handleSubmit} noValidate>

                        <Form.Group className="form-group" controlId="email">
                            <Form.Label>Correo Electrónico:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-group" controlId="password">
                            <Form.Label>Contraseña:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" className="btn w-100">Acceder</Button>
                        <p className="form-link">
                            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                        </p>
                    </Form>
                </Container>
            </section>
        </main>
    );
};

export default LoginPage;