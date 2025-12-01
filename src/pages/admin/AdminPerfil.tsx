import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { updateProfileApi } from '../../utils/api';
import { validateTextField, validatePassword } from '../../utils/validation';
import AdminNotificationModal from '../../components/AdminNotificationModal';
import '../../styles/AdminStyle.css';

const AdminPerfil = () => {
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                nombre: currentUser.name || '',
                apellidos: currentUser.surname || '',
                email: currentUser.email || ''
            });
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleModalClose = () => setShowNotifyModal(false);

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors: Record<string, string> = {};

        if (!validateTextField(formData.nombre, 30)) formErrors.nombre = 'Nombre inválido.';
        if (!validateTextField(formData.apellidos, 30)) formErrors.apellidos = 'Apellidos inválidos.';

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                await updateProfileApi({
                    name: formData.nombre,
                    surname: formData.apellidos
                });
                setModalInfo({ title: '¡Éxito!', message: 'Perfil actualizado con éxito.' });
                setShowNotifyModal(true);
            } catch (error) {
                setModalInfo({ title: 'Error', message: 'No se pudo actualizar el perfil.' });
                setShowNotifyModal(true);
            }
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordErrors({});

        const newErrors: Record<string, string> = {};
        if (!validatePassword(passwords.new)) newErrors.new = 'Mínimo 6 caracteres.';
        if (passwords.new !== passwords.confirm) newErrors.confirm = 'No coinciden.';

        if (Object.keys(newErrors).length > 0) {
            setPasswordErrors(newErrors);
            return;
        }

        try {
            await updateProfileApi({
                name: formData.nombre,
                surname: formData.apellidos,
                password: passwords.new
            });
            setModalInfo({ title: '¡Éxito!', message: 'Contraseña actualizada.' });
            setShowNotifyModal(true);
            setPasswords({ new: '', confirm: '' });
        } catch (error) {
            setModalInfo({ title: 'Error', message: 'Error al actualizar contraseña.' });
            setShowNotifyModal(true);
        }
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>Perfil de Administrador</h1>
            </div>

            <Row>
                <Col lg={6} className="mb-4">
                    <Card className="admin-card">
                        <Card.Header>Datos Personales</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleProfileSubmit} className="admin-form-container">
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Email (No editable)</Form.Label>
                                    <Form.Control value={formData.email} disabled />
                                </Form.Group>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} isInvalid={!!errors.nombre} />
                                </Form.Group>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} isInvalid={!!errors.apellidos} />
                                </Form.Group>
                                <Button type="submit" className="btn-admin">Actualizar Datos</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6} className="mb-4">
                    <Card className="admin-card">
                        <Card.Header>Seguridad</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handlePasswordSubmit} className="admin-form-container">
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <Form.Control type="password" name="new" value={passwords.new} onChange={handlePasswordChange} isInvalid={!!passwordErrors.new} />
                                    <Form.Control.Feedback type="invalid">{passwordErrors.new}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Confirmar Contraseña</Form.Label>
                                    <Form.Control type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} isInvalid={!!passwordErrors.confirm} />
                                    <Form.Control.Feedback type="invalid">{passwordErrors.confirm}</Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit" className="btn-admin">Cambiar Contraseña</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <AdminNotificationModal
                show={showNotifyModal}
                onHide={handleModalClose}
                title={modalInfo.title}
                message={modalInfo.message}
            />
        </>
    );
};

export default AdminPerfil;