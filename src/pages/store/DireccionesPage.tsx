import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getMyAddressesApi, createAddressApi, deleteAddressApi } from '../../utils/api';
import { regionesData } from '../../data/chileData';
import { validatePhone, validateRequiredField } from '../../utils/validation';
import '../../styles/Perfil.css';
import '../../styles/Forms.css';

const DireccionesPage = () => {
    const { currentUser } = useAuth();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        alias: '', region: '', comuna: '', calle: '', numero: '', depto: '',
        recibeNombre: '', recibeApellido: '', recibeTelefono: ''
    });
    const [comunas, setComunas] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const loadAddresses = async () => {
        try {
            const data = await getMyAddressesApi();
            setAddresses(data);
        } catch (e) {
            console.error("Error cargando direcciones", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) loadAddresses();
    }, [currentUser]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegionChange = (e: any) => {
        const region = e.target.value;
        setFormData({ ...formData, region, comuna: '' });
        const found = regionesData.find(r => r.nombre === region);
        setComunas(found ? found.comunas : []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAddressApi(formData);
            await loadAddresses();
            setShowForm(false);
            setFormData({
                alias: '', region: '', comuna: '', calle: '', numero: '', depto: '',
                recibeNombre: '', recibeApellido: '', recibeTelefono: ''
            });
        } catch (error) {
            alert('Error al guardar dirección');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Eliminar dirección?')) {
            await deleteAddressApi(id);
            loadAddresses();
        }
    };

    if (!currentUser) return <p>Debes iniciar sesión</p>;

    return (
        <main className="main-content" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <Container>
                <h2 className="section-title">Mis Direcciones</h2>
                
                {loading ? <Spinner animation="border" /> : (
                    <Row>
                        {addresses.map(addr => (
                            <Col md={6} key={addr.id} className="mb-3">
                                <Card>
                                    <Card.Header>{addr.alias}</Card.Header>
                                    <Card.Body>
                                        <p>{addr.calle} #{addr.numero}, {addr.comuna}</p>
                                        <p>Recibe: {addr.recibeNombre} ({addr.recibeTelefono})</p>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(addr.id)}>Eliminar</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {!showForm ? (
                    <Button className="mt-3" onClick={() => setShowForm(true)}>Nueva Dirección</Button>
                ) : (
                    <Card className="mt-4 p-3">
                        <h4>Nueva Dirección</h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Alias</Form.Label>
                                <Form.Control name="alias" value={formData.alias} onChange={handleChange} required />
                            </Form.Group>
                            
                            <Row>
                                <Col><Form.Select name="region" value={formData.region} onChange={handleRegionChange} required>
                                    <option value="">Región</option>
                                    {regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                                </Form.Select></Col>
                                <Col><Form.Select name="comuna" value={formData.comuna} onChange={handleChange} required>
                                    <option value="">Comuna</option>
                                    {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                                </Form.Select></Col>
                            </Row>
                            
                            <Form.Group className="mt-2">
                                <Form.Control placeholder="Calle" name="calle" value={formData.calle} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Control placeholder="Número" name="numero" value={formData.numero} onChange={handleChange} required />
                            </Form.Group>
                            
                            <h5 className="mt-3">Datos de quien recibe</h5>
                            <Row>
                                <Col><Form.Control placeholder="Nombre" name="recibeNombre" value={formData.recibeNombre} onChange={handleChange} required /></Col>
                                <Col><Form.Control placeholder="Apellido" name="recibeApellido" value={formData.recibeApellido} onChange={handleChange} required /></Col>
                            </Row>
                            <Form.Control className="mt-2" placeholder="Teléfono" name="recibeTelefono" value={formData.recibeTelefono} onChange={handleChange} required />

                            <div className="mt-3">
                                <Button type="submit" variant="success" className="me-2">Guardar</Button>
                                <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
                            </div>
                        </Form>
                    </Card>
                )}
            </Container>
        </main>
    );
};

export default DireccionesPage;