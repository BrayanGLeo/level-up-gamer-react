import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { validatePassword } from '../../utils/validation';
import NotificationModal from '../../components/NotificationModal';
import { updateProfileApi } from '../../utils/api';
import '../../styles/Forms.css';
import '../../styles/Perfil.css';

const PrivacidadPage = () => {
    const { currentUser } = useAuth();

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordErrors({});

        if (!currentUser) return;

        const newErrors: Record<string, string> = {};

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
            await updateProfileApi({
                name: currentUser.name,
                surname: currentUser.surname,
                password: passwords.new
            });

            setModalInfo({
                show: true,
                title: '¡Éxito!',
                message: 'Contraseña actualizada con éxito.'
            });
            setPasswords({ current: '', new: '', confirm: '' });

        } catch (error: any) {
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
                        <h2 className="section-title">Seguridad</h2>

                        <div className="mb-5">
                            <h3>Correo Electrónico</h3>
                            <Alert variant="info">
                                Tu correo actual es: <strong>{currentUser?.email}</strong>.
                                <br />Para cambiar tu correo, por favor contacta a soporte.
                            </Alert>
                        </div>

                        <Form id="changePasswordForm" className="settings-form" onSubmit={handlePasswordSubmit} noValidate>
                            <h3>Cambiar Contraseña</h3>
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