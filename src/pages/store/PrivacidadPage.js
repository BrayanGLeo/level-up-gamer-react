import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import NotificationModal from '../../components/NotificationModal';
import { saveUser, updateUserEmail, findUserByEmail } from '../../data/userData';
import '../../styles/Forms.css';
import '../../styles/Perfil.css';

const PrivacidadPage = () => {
    const { currentUser, updateCurrentUser } = useAuth();

    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setEmailError('');

        if (!validateEmail(newEmail)) {
            setEmailError('El correo no es válido (solo dominios permitidos).');
            return;
        }

        if (newEmail.toLowerCase() === currentUser.email.toLowerCase()) {
            setEmailError('El nuevo correo es igual al actual.');
            return;
        }

        const existingUser = findUserByEmail(newEmail);
        if (existingUser && existingUser.rut !== currentUser.rut) {
            setEmailError('Ese correo ya está en uso por otra cuenta.');
            return;
        }

        try {
            const updatedUser = updateUserEmail(currentUser.rut, newEmail.toLowerCase());
            updateCurrentUser(updatedUser);

            setModalInfo({
                show: true,
                title: '¡Éxito!',
                message: `Tu correo ha sido actualizado a ${newEmail}.`
            });
            setNewEmail('');

        } catch (error) {
            setModalInfo({
                show: true,
                title: 'Error',
                message: error.message
            });
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordErrors({});
        const newErrors = {};

        if (passwords.current !== currentUser.password) {
            newErrors.current = 'La contraseña actual no es correcta.';
        }
        if (!validatePassword(passwords.new)) {
            newErrors.new = 'La nueva contraseña debe tener al menos 6 caracteres.';
        }
        if (passwords.new !== passwords.confirm) {
            newErrors.confirm = 'Las nuevas contraseñas no coinciden.';
        }

        if (Object.keys(newErrors).length > 0) {
            setPasswordErrors(newErrors);
            return;
        }

        try {
            const updatedUser = { ...currentUser, password: passwords.new };
            saveUser(updatedUser);
            updateCurrentUser(updatedUser);

            setModalInfo({
                show: true,
                title: '¡Éxito!',
                message: 'Contraseña actualizada con éxito.'
            });
            setPasswords({ current: '', new: '', confirm: '' });

        } catch (error) {
            setModalInfo({
                show: true,
                title: 'Error',
                message: 'No se pudo actualizar la contraseña.'
            });
        }
    };

    const handleModalClose = () => {
        setModalInfo({ show: false, title: '', message: '' });
    };

    return (
        <>
            <main className="form-container" style={{ minHeight: '80vh', paddingTop: '100px' }}>
                <Container>
                    <section className="settings-section">
                        <h2 className="section-title">Configuración de Privacidad</h2>

                        <Form id="changeEmailForm" className="settings-form" onSubmit={handleEmailSubmit} noValidate>
                            <h3>Cambiar Correo Electrónico</h3>
                            <Form.Group className="form-group" controlId="current-email">
                                <Form.Label>Correo Actual</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={currentUser ? currentUser.email : ''}
                                    disabled
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="form-group" controlId="new-email">
                                <Form.Label>Nuevo Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    isInvalid={!!emailError}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" className="btn">Actualizar Correo</Button>
                        </Form>

                        <Form id="changePasswordForm" className="settings-form" onSubmit={handlePasswordSubmit} noValidate>
                            <h3>Cambiar Contraseña</h3>
                            <Form.Group className="form-group" controlId="current-password">
                                <Form.Label>Contraseña Actual</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="current"
                                    value={passwords.current}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!passwordErrors.current}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{passwordErrors.current}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="new-password">
                                <Form.Label>Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="new"
                                    value={passwords.new}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!passwordErrors.new}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{passwordErrors.new}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" controlId="confirm-password">
                                <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirm"
                                    value={passwords.confirm}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!passwordErrors.confirm}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{passwordErrors.confirm}</Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" className="btn">Actualizar Contraseña</Button>
                        </Form>
                    </section>
                </Container>
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

export default PrivacidadPage;