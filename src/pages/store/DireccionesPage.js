import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { addAddress, deleteAddress } from '../../data/userData';
import { regionesData } from '../../data/chileData';
import { validatePhone, validateRequiredField } from '../../utils/validation';
import '../../styles/Perfil.css';
import '../../styles/Forms.css';

const DireccionesPage = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        alias: '', region: '', comuna: '', calle: '', numero: '', depto: '',
        recibeNombre: '', recibeApellido: '', recibeTelefono: ''
    });
    const [comunas, setComunas] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (currentUser && currentUser.addresses) {
            setAddresses(currentUser.addresses);
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegionChange = (e) => {
        const regionNombre = e.target.value;
        setFormData({ ...formData, region: regionNombre, comuna: '' });
        const regionEncontrada = regionesData.find(r => r.nombre === regionNombre);
        setComunas(regionEncontrada ? regionEncontrada.comunas : []);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!validateRequiredField(formData.alias, 50)) newErrors.alias = 'El alias es requerido.';
        if (!formData.region) newErrors.region = 'La región es requerida.';
        if (!formData.comuna) newErrors.comuna = 'La comuna es requerida.';
        if (!validateRequiredField(formData.calle, 100)) newErrors.calle = 'La calle es requerida.';
        if (!validateRequiredField(formData.numero, 10)) newErrors.numero = 'El número es requerido.';
        if (!validateRequiredField(formData.recibeNombre, 50)) newErrors.recibeNombre = 'El nombre es requerido.';
        if (!validateRequiredField(formData.recibeApellido, 100)) newErrors.recibeApellido = 'El apellido es requerido.';
        if (!validatePhone(formData.recibeTelefono)) newErrors.recibeTelefono = 'El teléfono no es válido.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm() && currentUser) {

            const updatedUser = addAddress(currentUser.rut, formData);
            updateCurrentUser(updatedUser);

            setAddresses(updatedUser.addresses);
            setShowForm(false);
            setFormData({
                alias: '', region: '', comuna: '', calle: '', numero: '', depto: '',
                recibeNombre: '', recibeApellido: '', recibeTelefono: ''
            });
            setComunas([]);
        }
    };

    const handleDelete = (addressId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?') && currentUser) {

            const updatedUser = deleteAddress(currentUser.rut, addressId);
            updateCurrentUser(updatedUser);
            setAddresses(updatedUser.addresses);
        }
    };

    return (
        <main className="main-content" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <Container>
                <h2 className="section-title">Mis Direcciones</h2>
                <Row>
                    {addresses.length === 0 && !showForm && (
                        <Col>
                            <p>No tienes direcciones guardadas. ¡Añade una!</p>
                        </Col>
                    )}
                    {addresses.map(addr => (
                        <Col md={6} key={addr.id} className="mb-3">
                            <Card className="h-100">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{addr.alias}</Card.Title>
                                    <Card.Text>
                                        {addr.recibeNombre} {addr.recibeApellido} ({addr.recibeTelefono})<br />
                                        {addr.calle} {addr.numero} {addr.depto && `, ${addr.depto}`}<br />
                                        {addr.comuna}, {addr.region}
                                    </Card.Text>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(addr.id)} className="mt-auto">
                                        Eliminar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    <Col md={12} className="mt-3">
                        {!showForm ? (
                            <Button className="btn" onClick={() => setShowForm(true)}>
                                Agregar Nueva Dirección
                            </Button>
                        ) : (
                            <Card>
                                <Card.Body>
                                    <Card.Title>Nueva Dirección</Card.Title>
                                    <Form onSubmit={handleSubmit} noValidate>
                                        <Form.Group className="form-group" controlId="alias"><Form.Label>Alias (Ej: Casa, Oficina)</Form.Label><Form.Control type="text" name="alias" onChange={handleChange} isInvalid={!!errors.alias} /><Form.Control.Feedback type="invalid">{errors.alias}</Form.Control.Feedback></Form.Group>
                                        <Row>
                                            <Col md={6}><Form.Group className="form-group" controlId="region"><Form.Label>Región</Form.Label><Form.Select name="region" onChange={handleRegionChange} isInvalid={!!errors.region}><option value="">Selecciona una región</option>{regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback></Form.Group></Col>
                                            <Col md={6}><Form.Group className="form-group" controlId="comuna"><Form.Label>Comuna</Form.Label><Form.Select name="comuna" onChange={handleChange} isInvalid={!!errors.comuna} disabled={comunas.length === 0}><option value="">Selecciona una comuna</option>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback></Form.Group></Col>
                                        </Row>
                                        <Row>
                                            <Col md={8}><Form.Group className="form-group" controlId="calle"><Form.Label>Calle</Form.Label><Form.Control type="text" name="calle" onChange={handleChange} isInvalid={!!errors.calle} /><Form.Control.Feedback type="invalid">{errors.calle}</Form.Control.Feedback></Form.Group></Col>
                                            <Col md={4}><Form.Group className="form-group" controlId="numero"><Form.Label>Número</Form.Label><Form.Control type="text" name="numero" onChange={handleChange} isInvalid={!!errors.numero} /><Form.Control.Feedback type="invalid">{errors.numero}</Form.Control.Feedback></Form.Group></Col>
                                        </Row>
                                        <Form.Group className="form-group" controlId="depto"><Form.Label>N° Depto (Opcional)</Form.Label><Form.Control type="text" name="depto" onChange={handleChange} /></Form.Group>
                                        <hr />
                                        <h5>Datos de Quien Recibe</h5>
                                        <Row>
                                            <Col md={6}><Form.Group className="form-group" controlId="recibeNombre"><Form.Label>Nombre:</Form.Label><Form.Control type="text" name="recibeNombre" onChange={handleChange} isInvalid={!!errors.recibeNombre} /><Form.Control.Feedback type="invalid">{errors.recibeNombre}</Form.Control.Feedback></Form.Group></Col>
                                            <Col md={6}><Form.Group className="form-group" controlId="recibeApellido"><Form.Label>Apellido:</Form.Label><Form.Control type="text" name="recibeApellido" onChange={handleChange} isInvalid={!!errors.recibeApellido} /><Form.Control.Feedback type="invalid">{errors.recibeApellido}</Form.Control.Feedback></Form.Group></Col>
                                        </Row>
                                        <Form.Group className="form-group" controlId="recibeTelefono"><Form.Label>Teléfono:</Form.Label><Form.Control type="tel" name="recibeTelefono" onChange={handleChange} isInvalid={!!errors.recibeTelefono} /><Form.Control.Feedback type="invalid">{errors.recibeTelefono}</Form.Control.Feedback></Form.Group>

                                        <Button type="submit" className="btn me-2">Guardar Dirección</Button>
                                        <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </main>
    );
};

export default DireccionesPage;