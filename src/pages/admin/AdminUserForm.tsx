import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByRut, updateAdminUser } from '../../services/adminService';
import { registerApi } from '../../utils/api';
import { User } from '../../data/userData';
import { validateUserForm } from '../../utils/validation';
import { regionesData } from '../../data/chileData';
import '../../styles/AdminStyle.css';
import AdminNotificationModal from '../../components/AdminNotificationModal';
import { useAuth } from '../../context/AuthContext';

interface IUserFormData {
    run: string; nombre: string; apellidos: string; email: string; password?: string;
    fechaNacimiento: string; direccion: string; region: string; comuna: string; role: User['role'];
}

const AdminUserForm = () => {
    const [formData, setFormData] = useState<IUserFormData>({
        run: '', nombre: '', apellidos: '', email: '', password: '',
        fechaNacimiento: '', direccion: '', region: '', comuna: '', role: 'Cliente'
    });

    const { currentUser } = useAuth();
    const isRootAdmin = currentUser?.isOriginalAdmin === true;
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [comunas, setComunas] = useState<string[]>([]);
    const navigate = useNavigate();
    const { rut } = useParams<{ rut: string }>();
    const isEditMode = Boolean(rut);

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

    useEffect(() => {
        if (isEditMode && rut) {
            getUserByRut(rut).then(user => {
                setFormData({
                    run: user.rut, nombre: user.name, apellidos: user.surname, email: user.email,
                    fechaNacimiento: user.birthdate || '', direccion: user.direccion || '',
                    region: user.region || '', comuna: user.comuna || '', role: user.role, password: ''
                });
                if (user.region) {
                    const found = regionesData.find(r => r.nombre === user.region);
                    setComunas(found ? found.comunas : []);
                }
            }).catch(err => console.error("Error loading user", err));
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
        const formErrors: any = validateUserForm(formData as any);
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                if (isEditMode && rut) {
                    const userToUpdate: any = {
                        rut: formData.run, name: formData.nombre, surname: formData.apellidos,
                        email: formData.email, role: formData.role,
                        birthdate: formData.fechaNacimiento, direccion: formData.direccion,
                        region: formData.region, comuna: formData.comuna
                    };
                    if (formData.password) userToUpdate.password = formData.password;

                    await updateAdminUser(userToUpdate);
                    setModalInfo({ title: '¡Éxito!', message: 'Usuario actualizado con éxito' });
                } else {
                    await registerApi({
                        name: formData.nombre, surname: formData.apellidos, rut: formData.run,
                        email: formData.email, password: formData.password || '123456',
                        birthdate: formData.fechaNacimiento
                    });
                    setModalInfo({ title: '¡Éxito!', message: 'Usuario creado con éxito' });
                }
                setShowNotifyModal(true);
            } catch (error: any) {
                setModalInfo({ title: 'Error', message: error.message || 'Error al guardar usuario.' });
                setShowNotifyModal(true);
            }
        }
    };

    const handleModalClose = () => { setShowNotifyModal(false); navigate('/admin/usuarios'); };

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
                            <Form.Control name="run" value={formData.run} onChange={handleChange} isInvalid={!!errors.run} readOnly={isEditMode} />
                            <Form.Control.Feedback type="invalid">{errors.run}</Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                            <Col><Form.Group className="form-group mb-3"><Form.Label>Nombre</Form.Label><Form.Control name="nombre" value={formData.nombre} onChange={handleChange} /></Form.Group></Col>
                            <Col><Form.Group className="form-group mb-3"><Form.Label>Apellidos</Form.Label><Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} /></Form.Group></Col>
                        </Row>
                        <Form.Group className="form-group mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} />
                        </Form.Group>
                        {!isEditMode && (
                            <Form.Group className="form-group mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
                            </Form.Group>
                        )}
                        <Row>
                            <Col><Form.Group className="form-group mb-3"><Form.Label>Región</Form.Label><Form.Select name="region" value={formData.region} onChange={handleRegionChange}>{regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</Form.Select></Form.Group></Col>
                            <Col><Form.Group className="form-group mb-3"><Form.Label>Comuna</Form.Label><Form.Select name="comuna" value={formData.comuna} onChange={handleChange}>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</Form.Select></Form.Group></Col>
                        </Row>
                        <Form.Group className="form-group mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={handleChange} disabled={!isRootAdmin}>
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