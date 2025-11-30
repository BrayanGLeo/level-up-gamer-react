import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, LoginResult } from '../../context/AuthContext';
import { validateBasicEmail, validateLoginPassword } from '../../utils/validation';
import NotificationModal from '../../components/NotificationModal';
import '../../styles/Forms.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { login } = useAuth();
    const navigate = useNavigate();
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const [loginResult, setLoginResult] = useState<LoginResult | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        const emailToValidate = email.trim().toLowerCase();

        if (!validateBasicEmail(emailToValidate)) {
            newErrors.email = 'El formato del correo no es válido. (ej. usuario@dominio.cl)';
        }
        
        if (!validateLoginPassword(password)) {
            newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const result = await login(emailToValidate, password);

            setLoginResult(result);

            if (result.success) {
                setModalInfo({ show: true, title: '¡Bienvenido!', message: result.message });
            } else {
                setModalInfo({ show: true, title: 'Error de Inicio de Sesión', message: result.message });
            }
        }
    };

    const handleModalClose = () => {
        setModalInfo({ show: false, title: '', message: '' });

        if (loginResult && loginResult.success && loginResult.redirect) {
            navigate(loginResult.redirect);
        }

        setLoginResult(null);
    };

    return (
        <>
            <main className="form-container">
                <section className="login-section">
                    <Container>
                        <h2 className="section-title">Iniciar Sesión</h2>
                        <Form id="loginForm" onSubmit={handleSubmit} noValidate>
                            <Form.Group className="form-group" controlId="email">
                                <Form.Label>Correo Electrónico:</Form.Label>
                                <Form.Control type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} isInvalid={!!errors.email} />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="password">
                                <Form.Label>Contraseña:</Form.Label>
                                <Form.Control type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} isInvalid={!!errors.password} />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" className="btn w-100">Acceder</Button>
                            <p className="form-link">
                                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                            </p>
                        </Form>
                    </Container>
                </section>
            </main>

            <NotificationModal
                show={modalInfo.show}
                onHide={handleModalClose}
                title={modalInfo.title}
                message={modalInfo.message}
            />
        </>
    );
};

export default LoginPage;