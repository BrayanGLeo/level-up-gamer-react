import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Forms.css';
import '../../styles/Perfil.css';

const PrivacidadPage = () => {
    const { currentUser } = useAuth();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        alert('Correo electrónico actualizado con éxito (simulado).');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const newPass = e.target['new-password'].value;
        const confirmPass = e.target['confirm-password'].value;

        if (newPass !== confirmPass) {
            alert('Las nuevas contraseñas no coinciden.');
            return;
        }
        alert('Contraseña actualizada con éxito (simulado).');
        e.target.reset();
    };

    return (
        <main className="form-container" style={{ minHeight: '80vh', paddingTop: '100px' }}>
            <Container>
                <section className="settings-section">
                    <h2 className="section-title">Configuración de Privacidad</h2>

                    <Form id="changeEmailForm" className="settings-form" onSubmit={handleEmailSubmit}>
                        <h3>Cambiar Correo Electrónico</h3>
                        <Form.Group className="form-group" controlId="current-email">
                            <Form.Label>Correo Actual</Form.Label>
                            <Form.Control
                                type="email"
                                value={currentUser ? currentUser.email : ''}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="new-email">
                            <Form.Label>Nuevo Correo Electrónico</Form.Label>
                            <Form.Control type="email" required />
                        </Form.Group>
                        <Button type="submit" className="btn">Actualizar Correo</Button>
                    </Form>

                    <Form id="changePasswordForm" className="settings-form" onSubmit={handlePasswordSubmit}>
                        <h3>Cambiar Contraseña</h3>
                        <Form.Group className="form-group" controlId="current-password">
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control type="password" required />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="new-password">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control type="password" name="new-password" required />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="confirm-password">
                            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                            <Form.Control type="password" name="confirm-password" required />
                        </Form.Group>
                        <Button type="submit" className="btn">Actualizar Contraseña</Button>
                    </Form>
                </section>
            </Container>
        </main>
    );
};

export default PrivacidadPage;