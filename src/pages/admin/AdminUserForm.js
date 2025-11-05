import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { findUserByRut, saveUser, findUserByEmail, updateUserEmail } from '../../data/userData';
import { validateUserForm } from '../../utils/validation';
import '../../styles/AdminStyle.css';
import AdminNotificationModal from '../../components/AdminNotificationModal';

const regionesYComunas = {
    "Biobío": ["Concepción", "Los Ángeles", "Talcahuano", "Coronel", "Chiguayante", "Hualpén"],
    "Metropolitana": ["Santiago", "Maipú", "Puente Alto", "La Florida", "Las Condes", "Ñuñoa"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Los Andes"],
    "Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Lautaro", "Carahue"],
    "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Los Vilos", "Andacollo"]
};

const AdminUserForm = () => {
    const [formData, setFormData] = useState({
        run: '',
        nombre: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        direccion: '',
        region: '',
        comuna: '',
        role: 'Cliente'
    });
    const [errors, setErrors] = useState({});
    const [comunas, setComunas] = useState([]);
    const navigate = useNavigate();
    const { rut } = useParams();
    const isEditMode = Boolean(rut);

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

    useEffect(() => {
        if (isEditMode) {
            const user = findUserByRut(rut);
            if (user) {
                setFormData({
                    run: user.rut || '',
                    nombre: user.name,
                    apellidos: user.surname,
                    email: user.email,
                    fechaNacimiento: user.fechaNacimiento || '',
                    direccion: user.direccion || '',
                    region: user.region || '',
                    comuna: user.comuna || '',
                    role: user.role
                });

                if (user.region) {
                    setComunas(regionesYComunas[user.region] || []);
                }
            }
        }
    }, [isEditMode, rut]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegionChange = (e) => {
        const region = e.target.value;
        setFormData({ ...formData, region: region, comuna: '' });
        setComunas(regionesYComunas[region] || []);
    };

    const handleModalClose = () => {
        setShowNotifyModal(false);
        navigate('/admin/usuarios');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateUserForm(formData);

        const existingUser = findUserByEmail(formData.email);

        if (isEditMode) {
            if (existingUser && existingUser.rut !== formData.run) {
                formErrors.email = 'Este correo ya está en uso por otro usuario.';
            }
        } else {
            if (existingUser) {
                formErrors.email = 'Este correo ya está en uso por otro usuario.';
            }
            if (findUserByRut(formData.run)) {
                formErrors.run = 'Este RUT ya está en uso por otro usuario.';
            }
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            const userToSave = {
                ...formData,
                name: formData.nombre,
                surname: formData.apellidos,
            };

            const userOriginal = isEditMode ? findUserByRut(formData.run) : null;

            saveUser(userToSave);

            if (isEditMode && userOriginal.email !== formData.email) {
                try {
                    updateUserEmail(formData.run, formData.email);
                } catch (error) {
                    setErrors({ email: error.message });
                    return;
                }
            }
            
            const message = isEditMode ? 'Usuario actualizado con éxito' : 'Usuario guardado con éxito';
            setModalInfo({ title: '¡Éxito!', message: message });
            setShowNotifyModal(true);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>
            </header>
            <section className="admin-form-container">
                <Form id="nuevoUsuarioForm" onSubmit={handleSubmit} noValidate>

                    <Form.Group className="form-group" controlId="run">
                        <Form.Label>RUN:</Form.Label>
                        <Form.Control
                            type="text"
                            name="run"
                            value={formData.run}
                            onChange={handleChange}
                            readOnly={isEditMode}
                            isInvalid={!!errors.run}
                        />
                        <Form.Control.Feedback type="invalid">{errors.run}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="form-group" controlId="nombre">
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    isInvalid={!!errors.nombre}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" controlId="apellidos">
                                <Form.Label>Apellidos:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    isInvalid={!!errors.apellidos}
                                />
                                <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="form-group" controlId="email">
                        <Form.Label>Correo Electrónico:</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly={false}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="form-group" controlId="direccion">
                        <Form.Label>Dirección:</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            isInvalid={!!errors.direccion}
                        />
                        <Form.Control.Feedback type="invalid">{errors.direccion}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="form-group" controlId="region">
                                <Form.Label>Región:</Form.Label>
                                <Form.Select name="region" value={formData.region} onChange={handleRegionChange} isInvalid={!!errors.region}>
                                    <option value="">Seleccione una región</option>
                                    {Object.keys(regionesYComunas).map(region => (
                                        <option key={region} value={region}>{region}</option>
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

                    <Form.Group className="form-group" controlId="role">
                        <Form.Label>Tipo de Usuario:</Form.Label>
                        <Form.Select name="role" value={formData.role} onChange={handleChange} isInvalid={!!errors.role}>
                            <option value="">Seleccione un tipo</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Vendedor">Vendedor</option>
                            <option value="Cliente">Cliente</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className="btn-admin">
                        {isEditMode ? 'Actualizar Usuario' : 'Registrar Usuario'}
                    </Button>
                </Form>
            </section>

            <AdminNotificationModal
                show={showNotifyModal}
                onHide={handleModalClose}
                title={modalInfo.title}
                message={modalInfo.message}
            />
        </>
    );
};

export default AdminUserForm;