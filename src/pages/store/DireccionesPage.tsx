import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { addAddress, deleteAddress, updateAddress, Address } from '../../data/userData';
import { regionesData } from '../../data/chileData';
import { validatePhone, validateRequiredField } from '../../utils/validation';
import '../../styles/Perfil.css';
import '../../styles/Forms.css';

interface IAddressForm {
    alias: string; region: string; comuna: string; calle: string; numero: string; depto: string;
    recibeNombre: string; recibeApellido: string; recibeTelefono: string;
}

const initialFormState: IAddressForm = {
    alias: '', region: '', comuna: '', calle: '', numero: '', depto: '',
    recibeNombre: '', recibeApellido: '', recibeTelefono: ''
};

const DireccionesPage = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<IAddressForm>(initialFormState);
    const [comunas, setComunas] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

    useEffect(() => {
        if (currentUser && currentUser.addresses) {
            setAddresses(currentUser.addresses);
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const regionNombre = e.target.value;
        setFormData({ ...formData, region: regionNombre, comuna: '' });
        const regionEncontrada = regionesData.find(r => r.nombre === regionNombre);
        setComunas(regionEncontrada ? regionEncontrada.comunas : []);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
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

    const handleEdit = (address: Address) => {
        setEditingAddressId(address.id);
        setFormData(address);
        
        const regionEncontrada = regionesData.find(r => r.nombre === address.region);
        setComunas(regionEncontrada ? regionEncontrada.comunas : []);

        setShowForm(true);
        window.scrollTo(0, document.body.scrollHeight);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAddressId(null);
        setFormData(initialFormState);
        setErrors({});
        setComunas([]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm() && currentUser) {
            let updatedUser;

            if (editingAddressId) {
                updatedUser = updateAddress(currentUser.rut, { ...formData, id: editingAddressId });
            } else {
                updatedUser = addAddress(currentUser.rut, formData);
            }

            if (updatedUser) {
                updateCurrentUser(updatedUser);
                setAddresses(updatedUser.addresses);
            }

            handleCancel();
        }
    };

    const handleDelete = (addressId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?') && currentUser) {
            const updatedUser = deleteAddress(currentUser.rut, addressId);
            if (updatedUser) {
                updateCurrentUser(updatedUser);
                setAddresses(updatedUser.addresses);
            }
        }
    };

    return (
        <main className="main-content" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <Container>
                <h2 className="section-title">Mis Direcciones</h2>
                <Row className="address-card-row">
                    {addresses.length === 0 && !showForm && (
                        <Col className="text-center">
                            <p>No tienes direcciones guardadas. ¡Añade una!</p>
                        </Col>
                    )}
                    {addresses.map(addr => (
                        <Col md={6} key={addr.id} className="mb-3">
                            <Card border="secondary">
                                <Card.Header as="h5" style={{ color: '#39FF14' }}>{addr.alias}</Card.Header>
                                <Card.Body style={{ flex: '0 1 auto' }}>
                                    <Card.Text>
                                        <strong>Recibe:</strong> {addr.recibeNombre} {addr.recibeApellido} ({addr.recibeTelefono})<br />
                                        <strong>Dirección:</strong> {addr.calle} {addr.numero} {addr.depto && `, ${addr.depto}`}<br />
                                        {addr.comuna}, {addr.region}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="text-end">
                                    <Button variant="outline-warning" size="sm" onClick={() => handleEdit(addr)} className="me-2">
                                        Editar
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(addr.id)}>
                                        Eliminar
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}

                    <Col md={12} className="mt-3">
                        {!showForm ? (
                            <div className="text-center">
                                <Button className="btn" onClick={() => {
                                    setShowForm(true);
                                    setEditingAddressId(null);
                                    setFormData(initialFormState);
                                }}>
                                    Agregar Nueva Dirección
                                </Button>
                            </div>
                        ) : (
                            <Card>
                                <Card.Body>
                                    <Card.Title>{editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}</Card.Title>
                                    
                                    <Form onSubmit={handleSubmit} noValidate>
                                        <Form.Group className="form-group" controlId="alias"><Form.Label>Alias (Ej: Casa, Oficina)</Form.Label><Form.Control type="text" name="alias" value={formData.alias} onChange={handleChange} isInvalid={!!errors.alias} /><Form.Control.Feedback type="invalid">{errors.alias}</Form.Control.Feedback></Form.Group>
                                        <Row>
                                            <Col md={6}><Form.Group className="form-group" controlId="region"><Form.Label>Región</Form.Label><Form.Select name="region" value={formData.region} onChange={handleRegionChange} isInvalid={!!errors.region}><option value="">Selecciona una región</option>{regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback></Form.Group></Col>
                                            <Col md={6}><Form.Group className="form-group" controlId="comuna"><Form.Label>Comuna</Form.Label><Form.Select name="comuna" value={formData.comuna} onChange={handleChange} isInvalid={!!errors.comuna} disabled={comunas.length === 0}><option value="">Selecciona una comuna</option>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback></Form.Group></Col>
                                        </Row>
                                        <Row>
                                            <Col md={8}><Form.Group className="form-group" controlId="calle"><Form.Label>Calle</Form.Label><Form.Control type="text" name="calle" value={formData.calle} onChange={handleChange} isInvalid={!!errors.calle} /><Form.Control.Feedback type="invalid">{errors.calle}</Form.Control.Feedback></Form.Group></Col>
                                            <Col md={4}><Form.Group className="form-group" controlId="numero"><Form.Label>Número</Form.Label><Form.Control type="text" name="numero" value={formData.numero} onChange={handleChange} isInvalid={!!errors.numero} /><Form.Control.Feedback type="invalid">{errors.numero}</Form.Control.Feedback></Form.Group></Col>
                                        </Row>
                                        <Form.Group className="form-group" controlId="depto"><Form.Label>N° Depto (Opcional)</Form.Label><Form.Control type="text" name="depto" value={formData.depto} onChange={handleChange} /></Form.Group>
                                        <hr />
                                        <h5>Datos de Quien Recibe</h5>
                                        <Row>
                                            <Col md={6}><Form.Group className="form-group" controlId="recibeNombre"><Form.Label>Nombre:</Form.Label><Form.Control type="text" name="recibeNombre" value={formData.recibeNombre} onChange={handleChange} isInvalid={!!errors.recibeNombre} /><Form.Control.Feedback type="invalid">{errors.recibeNombre}</Form.Control.Feedback></Form.Group></Col>
                                            <Col md={6}><Form.Group className="form-group" controlId="recibeApellido"><Form.Label>Apellido:</Form.Label><Form.Control type="text" name="recibeApellido" value={formData.recibeApellido} onChange={handleChange} isInvalid={!!errors.recibeApellido} /><Form.Control.Feedback type="invalid">{errors.recibeApellido}</Form.Control.Feedback></Form.Group></Col>
                                        </Row>
                                        <Form.Group className="form-group" controlId="recibeTelefono"><Form.Label>Teléfono:</Form.Label><Form.Control type="tel" name="recibeTelefono" value={formData.recibeTelefono} onChange={handleChange} isInvalid={!!errors.recibeTelefono} /><Form.Control.Feedback type="invalid">{errors.recibeTelefono}</Form.Control.Feedback></Form.Group>

                                        <Button type="submit" className="btn me-2">{editingAddressId ? 'Actualizar Dirección' : 'Guardar Dirección'}</Button>
                                        <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
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