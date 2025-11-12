import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, LoginResult } from '../../context/AuthContext';
import { validateRegisterEmail, validatePassword, validateTextField, validateRut, validateBirthdate } from '../../utils/validation';
import NotificationModal from '../../components/NotificationModal';
import '../../styles/Forms.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        names: '',
        surnames: '',
        rut: '',
        email: '',
        birthdate: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const [registrationResult, setRegistrationResult] = useState<LoginResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newErrors: Record<string, string> = {};

        if (!validateTextField(formData.names, 30)) newErrors.names = 'El nombre solo debe contener letras y espacios (máx 30 caracteres).';
        if (!validateTextField(formData.surnames, 30)) newErrors.surnames = 'El apellido solo debe contener letras y espacios (máx 30 caracteres).';
        if (!validateRut(formData.rut)) newErrors.rut = 'El RUT no es válido (ej: 12345678-9).';
        
        if (!validateRegisterEmail(formData.email)) {
            newErrors.email = 'Correo inválido. Dominios permitidos: gmail, duoc, outlook, live, hotmail.';
        }
        
        if (!validateBirthdate(formData.birthdate)) newErrors.birthdate = 'Fecha inválida. Debes ser mayor de 18 años';
        if (!validatePassword(formData.password)) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const result = register({
                name: formData.names,
                surname: formData.surnames,
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                rut: formData.rut,
                birthdate: formData.birthdate
            });

            setRegistrationResult(result);

            if (result.success) {
                setModalInfo({ show: true, title: '¡Registro Exitoso!', message: result.message });
            } else {
                setModalInfo({ show: true, title: 'Error de Registro', message: result.message });
            }
        }
    };

    const handleModalClose = () => {
        setModalInfo({ show: false, title: '', message: '' });
        if (registrationResult && registrationResult.success && registrationResult.redirect) {
            navigate(registrationResult.redirect);
        }

        setRegistrationResult(null);
    };

    return (
        <>
            <main className="form-container">
                <section className="register-section">
                    <Container>
                        <h2 className="section-title">Crear una Cuenta</h2>
                        <Form id="registerForm" onSubmit={handleSubmit} noValidate>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="form-group" controlId="names">
                                        <Form.Label>Nombres:</Form.Label>
                                        <Form.Control type="text" name="names" required onChange={handleChange} isInvalid={!!errors.names} />
                                        <Form.Control.Feedback type="invalid">{errors.names}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="form-group" controlId="surnames">
                                        <Form.Label>Apellidos:</Form.Label>
                                        <Form.Control type="text" name="surnames" required onChange={handleChange} isInvalid={!!errors.surnames} />
                                        <Form.Control.Feedback type="invalid">{errors.surnames}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="form-group" controlId="rut">
                                <Form.Label>RUT:</Form.Label>
                                <Form.Control type="text" name="rut" placeholder="Ej: 12345678-K" required onChange={handleChange} isInvalid={!!errors.rut} />
                                <Form.Control.Feedback type="invalid">{errors.rut}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="email">
                                <Form.Label>Correo Electrónico:</Form.Label>
                                <Form.Control type="email" name="email" placeholder="ejemplo@gmail.com" required onChange={handleChange} isInvalid={!!errors.email} />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="birthdate">
                                <Form.Label>Fecha de Nacimiento:</Form.Label>
                                <Form.Control type="date" name="birthdate" required onChange={handleChange} isInvalid={!!errors.birthdate} />
                                <Form.Control.Feedback type="invalid">{errors.birthdate}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="password">
                                <Form.Label>Contraseña:</Form.Label>
                                <Form.Control type="password" name="password" required onChange={handleChange} isInvalid={!!errors.password} />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="confirm-password">
                                <Form.Label>Confirmar Contraseña:</Form.Label>
                                <Form.Control type="password" name="confirmPassword" required onChange={handleChange} isInvalid={!!errors.confirmPassword} />
                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" className="btn w-100">Registrarse</Button>
                            <p className="form-link">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
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

export default RegisterPage;