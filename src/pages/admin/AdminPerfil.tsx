import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { saveUser, updateUserEmail, User } from '../../data/userData';
import { validateTextField, validateBasicEmail, validateBirthdate, validateRequiredField, validatePassword } from '../../utils/validation';
import { regionesData } from '../../data/chileData';
import AdminNotificationModal from '../../components/AdminNotificationModal';
import '../../styles/AdminStyle.css';

interface IFormData {
    run: string;
    nombre: string;
    apellidos: string;
    email: string;
    fechaNacimiento: string;
    direccion: string;
    region: string;
    comuna: string;
}

const AdminPerfil = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    
    const [formData, setFormData] = useState<IFormData>({
        run: '',
        nombre: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        direccion: '',
        region: '',
        comuna: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [comunas, setComunas] = useState<string[]>([]);

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                run: currentUser.rut || '',
                nombre: currentUser.name || '',
                apellidos: currentUser.surname || '',
                email: currentUser.email || '',
                fechaNacimiento: currentUser.birthdate || '',
                direccion: currentUser.direccion || '',
                region: currentUser.region || '',
                comuna: currentUser.comuna || ''
            });

            if (currentUser.region) {
                const regionEncontrada = regionesData.find(r => r.nombre === currentUser.region);
                setComunas(regionEncontrada ? regionEncontrada.comunas : []);
            }
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const region = e.target.value;
        setFormData({ ...formData, region: region, comuna: '' });
        const regionEncontrada = regionesData.find(r => r.nombre === region);
        setComunas(regionEncontrada ? regionEncontrada.comunas : []);
    };

    const handleModalClose = () => {
        setShowNotifyModal(false);
    };

    const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!currentUser) {
            setErrors({ form: "No se ha encontrado el usuario actual." });
            return;
        }

        const formErrors: Record<string, string> = {};
        
        if (!validateTextField(formData.nombre, 30)) formErrors.nombre = 'Nombre inválido.';
        if (!validateTextField(formData.apellidos, 30)) formErrors.apellidos = 'Apellidos inválidos.';
        if (!validateBasicEmail(formData.email)) formErrors.email = 'El formato del correo no es válido.';
        if (!validateBirthdate(formData.fechaNacimiento)) formErrors.fechaNacimiento = 'Debes ser mayor de 18.';
        if (!validateRequiredField(formData.direccion, 300)) formErrors.direccion = 'La dirección es requerida.';
        if (!formData.region) formErrors.region = 'Debe seleccionar una región.';
        if (!formData.comuna) formErrors.comuna = 'Debe seleccionar una comuna.';

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            let userToSave: User = {
                ...currentUser,
                name: formData.nombre,
                surname: formData.apellidos,
                birthdate: formData.fechaNacimiento,
                direccion: formData.direccion,
                region: formData.region,
                comuna: formData.comuna
            };

            if (currentUser.email !== formData.email) {
                try {
                    userToSave = updateUserEmail(currentUser.rut, formData.email);
                } catch (error: any) {
                    setErrors({ email: error.message });
                    return;
                }
            }
            
            const updatedUser = saveUser(userToSave);
            
            updateCurrentUser(updatedUser);

            setModalInfo({ title: '¡Éxito!', message: 'Perfil actualizado con éxito.' });
            setShowNotifyModal(true);
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordErrors({});
        
        if (!currentUser) {
            setPasswordErrors({ form: "No se ha encontrado el usuario actual." });
            return;
        }

        const newErrors: Record<string, string> = {};

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

            setModalInfo({ title: '¡Éxito!', message: 'Contraseña actualizada con éxito.' });
            setShowNotifyModal(true);
            setPasswords({ current: '', new: '', confirm: '' });

        } catch (error: any) {
            setModalInfo({
                title: 'Error',
                message: 'No se pudo actualizar la contraseña.'
            });
        }
    };


    return (
        <>
            <div className="admin-page-header">
                <h1>Perfil de Administrador</h1>
            </div>

            <Row>
                <Col lg={7} className="mb-4">
                    <Card className="admin-card">
                        <Card.Header>Información Personal</Card.Header>
                        <Card.Body>
                            <Form id="adminProfileForm" onSubmit={handleProfileSubmit} className="admin-form-container">
                                
                                <Form.Group className="form-group" controlId="run">
                                    <Form.Label>RUN:</Form.Label>
                                    <Form.Control type="text" value={formData.run} readOnly disabled />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="form-group" controlId="nombre">
                                            <Form.Label>Nombre:</Form.Label>
                                            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} isInvalid={!!errors.nombre} />
                                            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="form-group" controlId="apellidos">
                                            <Form.Label>Apellidos:</Form.Label>
                                            <Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} isInvalid={!!errors.apellidos} />
                                            <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="form-group" controlId="email">
                                    <Form.Label>Correo Electrónico:</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)} isInvalid={!!errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group className="form-group" controlId="fechaNacimiento">
                                    <Form.Label>Fecha de Nacimiento:</Form.Label>
                                    <Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} isInvalid={!!errors.fechaNacimiento} />
                                    <Form.Control.Feedback type="invalid">{errors.fechaNacimiento}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group" controlId="direccion">
                                    <Form.Label>Dirección:</Form.Label>
                                    <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleChange} isInvalid={!!errors.direccion} />
                                    <Form.Control.Feedback type="invalid">{errors.direccion}</Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="form-group" controlId="region">
                                            <Form.Label>Región:</Form.Label>
                                            <Form.Select name="region" value={formData.region} onChange={handleRegionChange} isInvalid={!!errors.region}>
                                                <option value="">Seleccione una región</option>
                                                {regionesData.map(region => (
                                                    <option key={region.nombre} value={region.nombre}>{region.nombre}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="form-group" controlId="comuna">
                                            <Form.Label>Comuna:</Form.Label>
                                            <Form.Select name="comuna" value={formData.comuna} onChange={handleChange} isInvalid={!!errors.comuna} disabled={comunas.length === 0}>
                                                <option value="">Seleccione una comuna</option>
                                                {comunas.map(comuna => (
                                                    <option key={comuna} value={comuna}>{comuna}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="text-end mt-3">
                                    <Button type="submit" className="btn-admin">
                                        Actualizar Perfil
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5} className="mb-4">
                    <Card className="admin-card">
                        <Card.Header>Cambiar Contraseña</Card.Header>
                        <Card.Body>
                            <Form id="adminPasswordForm" onSubmit={handlePasswordSubmit} className="admin-form-container">
                                
                                <Form.Group className="form-group" controlId="current">
                                    <Form.Label>Contraseña Actual:</Form.Label>
                                    <Form.Control type="password" name="current" value={passwords.current} onChange={handlePasswordChange} isInvalid={!!passwordErrors.current} required />
                                    <Form.Control.Feedback type="invalid">{passwordErrors.current}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group" controlId="new">
                                    <Form.Label>Nueva Contraseña:</Form.Label>
                                    <Form.Control type="password" name="new" value={passwords.new} onChange={handlePasswordChange} isInvalid={!!passwordErrors.new} required />
                                    <Form.Control.Feedback type="invalid">{passwordErrors.new}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group" controlId="confirm">
                                    <Form.Label>Confirmar Contraseña:</Form.Label>
                                    <Form.Control type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} isInvalid={!!passwordErrors.confirm} required />
                                    <Form.Control.Feedback type="invalid">{passwordErrors.confirm}</Form.Control.Feedback>
                                </Form.Group>

                                <div className="text-end mt-3">
                                    <Button type="submit" className="btn-admin">
                                        Cambiar Contraseña
                                    </Button>
                                </div>
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