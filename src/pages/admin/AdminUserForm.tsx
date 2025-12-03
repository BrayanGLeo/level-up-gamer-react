import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByRut, updateAdminUser, createUser } from '../../services/adminService';
import { User } from '../../data/userData';
import { validateBasicEmail, validateRut, validateTextField, validateBirthdate } from '../../utils/validation';
import { regionesData } from '../../data/chileData';
import '../../styles/AdminStyle.css';
import AdminNotificationModal from '../../components/AdminNotificationModal';

interface IUserFormData {
    run: string;
    nombre: string;
    apellidos: string;
    email: string;
    password?: string;
    fechaNacimiento: string;
    direccion: string;
    region: string;
    comuna: string;
    role: User['role'];
}

const AdminUserForm = () => {
    const [formData, setFormData] = useState<IUserFormData>({
        run: '', nombre: '', apellidos: '', email: '', password: '',
        fechaNacimiento: '', direccion: '', region: '', comuna: '', role: 'Cliente'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [comunas, setComunas] = useState<string[]>([]);
    const navigate = useNavigate();
    const { rut } = useParams<{ rut: string }>();
    const isEditMode = Boolean(rut);

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isEditMode && rut) {
            getUserByRut(rut).then(user => {
                setFormData({
                    run: user.rut,
                    nombre: user.name,
                    apellidos: user.surname,
                    email: user.email,
                    fechaNacimiento: user.birthdate || '',
                    direccion: user.direccion || '',
                    region: user.region || '',
                    comuna: user.comuna || '',
                    role: user.role,
                    password: ''
                });
                if (user.region) {
                    const found = regionesData.find(r => r.nombre === user.region);
                    setComunas(found ? found.comunas : []);
                }
            }).catch(err => console.error("Error cargando usuario", err));
        }
    }, [isEditMode, rut]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegionChange = (e: any) => {
        const region = e.target.value;
        setFormData({ ...formData, region, comuna: '' });
        const found = regionesData.find(r => r.nombre === region);
        setComunas(found ? found.comunas : []);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!validateRut(formData.run)) {
            newErrors.run = 'El RUT ingresado no es válido (ej: 12345678-9).';
        }

        if (!formData.fechaNacimiento) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
        } else if (!validateBirthdate(formData.fechaNacimiento)) {
            newErrors.fechaNacimiento = 'Debes ser mayor de 18 años.';
        }

        if (!validateTextField(formData.nombre, 30)) {
            newErrors.nombre = 'Nombre inválido (solo letras, máx 30).';
        }
        if (!validateTextField(formData.apellidos, 30)) {
            newErrors.apellidos = 'Apellidos inválidos (solo letras, máx 30).';
        }
        if (!validateBasicEmail(formData.email)) {
            newErrors.email = 'Formato de correo inválido.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const userPayload: any = {
                    rut: formData.run,
                    nombre: formData.nombre,
                    apellido: formData.apellidos,
                    email: formData.email,
                    rol: formData.role,
                    fechaNacimiento: formData.fechaNacimiento
                };

                if (formData.password) {
                    userPayload.password = formData.password;
                } else if (!isEditMode) {
                    userPayload.password = '123456';
                }

                if (isEditMode && rut) {
                    await updateAdminUser(userPayload);
                    setModalInfo({ title: '¡Éxito!', message: 'Usuario actualizado con éxito' });
                } else {
                    await createUser(userPayload);
                    setModalInfo({ title: '¡Éxito!', message: 'Usuario creado con éxito' });
                }

                setIsSuccess(true);
                setShowNotifyModal(true);

            } catch (error: any) {
                console.error(error);
                setIsSuccess(false);

                let errorMsg = error.message || 'Error al guardar usuario.';

                if (errorMsg.includes('RUT')) {
                    setErrors(prev => ({ ...prev, run: 'Este RUT ya está registrado en el sistema.' }));
                } else if (errorMsg.includes('correo')) {
                    setErrors(prev => ({ ...prev, email: 'Este correo ya está registrado.' }));
                }

                setModalInfo({ title: 'Error', message: errorMsg });
                setShowNotifyModal(true);
            }
        }
    };

    const handleModalClose = () => {
        setShowNotifyModal(false);
        if (isSuccess) {
            navigate('/admin/usuarios');
        }
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>
            </div>
            <Card className="admin-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit} className="admin-form-container">
                        <Form.Group className="form-group mb-3">
                            <Form.Label>RUN</Form.Label>
                            <Form.Control
                                name="run"
                                value={formData.run}
                                onChange={handleChange}
                                isInvalid={!!errors.run}
                                readOnly={isEditMode}
                                placeholder="12.345.678-9"
                            />
                            <Form.Control.Feedback type="invalid">{errors.run}</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} isInvalid={!!errors.nombre} />
                                    <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} isInvalid={!!errors.apellidos} />
                                    <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="form-group mb-3">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechaNacimiento"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChange}
                                        isInvalid={!!errors.fechaNacimiento}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.fechaNacimiento}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        {!isEditMode && (
                            <Form.Group className="form-group mb-3">
                                <Form.Label>Contraseña (Por defecto: 123456)</Form.Label>
                                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Ingresar contraseña" />
                            </Form.Group>
                        )}

                        <div className="p-3 mb-3" style={{ border: '1px dashed #ccc', borderRadius: '5px' }}>
                            <small className="text-muted d-block mb-2">Datos opcionales (Ubicación)</small>
                            <Row>
                                <Col><Form.Group className="form-group mb-3"><Form.Label>Región</Form.Label><Form.Select name="region" value={formData.region} onChange={handleRegionChange}>{regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</Form.Select></Form.Group></Col>
                                <Col><Form.Group className="form-group mb-3"><Form.Label>Comuna</Form.Label><Form.Select name="comuna" value={formData.comuna} onChange={handleChange}>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</Form.Select></Form.Group></Col>
                            </Row>
                        </div>

                        <Form.Group className="form-group mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={handleChange}>
                                <option value="Cliente">Cliente</option>
                                <option value="Vendedor">Vendedor</option>
                                <option value="Administrador">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" className="btn-admin">Guardar</Button>
                    </Form>
                </Card.Body>
            </Card>
            <AdminNotificationModal show={showNotifyModal} onHide={handleModalClose} title={modalInfo.title} message={modalInfo.message} />
        </>
    );
};

export default AdminUserForm;