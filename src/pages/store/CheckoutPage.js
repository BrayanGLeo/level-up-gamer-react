import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Nav, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { regionesData } from '../../data/chileData';
import { addOrderToUser } from '../../data/userData';
import { validateRut, validateEmail, validatePhone, validateRequiredField } from '../../utils/validation';
import NotificationModal from '../../components/NotificationModal';
import '../../styles/Forms.css';
import '../../styles/Checkout.css';

const initialFormState = {
    nombre: '', apellidos: '', rut: '', email: '', telefono: '',
    region: '', comuna: '', calle: '', numero: '', depto: '',
    recibeNombre: '', recibeApellido: '', recibeTelefono: ''
};

const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [deliveryMethod, setDeliveryMethod] = useState('despacho');
    const [comunas, setComunas] = useState([]);

    const { currentUser, updateCurrentUser } = useAuth();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                nombre: currentUser.name,
                apellidos: currentUser.surname,
                email: currentUser.email,
                rut: currentUser.rut || '',
            }));
            if (currentUser.addresses && currentUser.addresses.length > 0) {
                setSavedAddresses(currentUser.addresses);
            }
        }
    }, [currentUser]);

    const validateStep1 = () => {
        const newErrors = {};
        if (!validateRequiredField(formData.nombre, 50)) newErrors.nombre = 'El nombre es requerido.';
        if (!validateRequiredField(formData.apellidos, 100)) newErrors.apellidos = 'El apellido es requerido.';
        if (!validateRut(formData.rut)) newErrors.rut = 'El RUT no es válido.';
        if (!validateEmail(formData.email)) newErrors.email = 'El E-mail no es válido.';
        if (!validatePhone(formData.telefono)) newErrors.telefono = 'El teléfono no es válido (ej: 912345678).';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateStep2 = () => {
        const newErrors = {};
        if (deliveryMethod === 'despacho') {
            if (!formData.region) newErrors.region = 'Selecciona una región.';
            if (!formData.comuna) newErrors.comuna = 'Selecciona una comuna.';
            if (!validateRequiredField(formData.calle, 100)) newErrors.calle = 'La calle es requerida.';
            if (!validateRequiredField(formData.numero, 10)) newErrors.numero = 'El número es requerido.';
            if (!validateRequiredField(formData.recibeNombre, 50)) newErrors.recibeNombre = 'El nombre es requerido.';
            if (!validateRequiredField(formData.recibeApellido, 100)) newErrors.recibeApellido = 'El apellido es requerido.';
            if (!validatePhone(formData.recibeTelefono)) newErrors.recibeTelefono = 'El teléfono no es válido.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSelectedAddressId('new');
    };
    const handleRegionChange = (e) => {
        const regionNombre = e.target.value;
        setFormData({ ...formData, region: regionNombre, comuna: '' });
        const regionEncontrada = regionesData.find(r => r.nombre === regionNombre);
        setComunas(regionEncontrada ? regionEncontrada.comunas : []);
        setSelectedAddressId('new');
    };
    const handleSelectAddress = (address) => {
        setFormData({ ...formData, ...address });
        setSelectedAddressId(address.id);
        const regionEncontrada = regionesData.find(r => r.nombre === address.region);
        setComunas(regionEncontrada ? regionEncontrada.comunas : []);
        setErrors({});
    };
    const nextStep = () => {
        let isValid = false;
        if (step === 1) isValid = validateStep1();
        if (step === 2) isValid = validateStep2();
        if (step === 3) isValid = true;
        if (isValid) {
            setErrors({});
            setStep(prev => prev + 1);
        }
    };
    const prevStep = () => setStep(prev => prev - 1);
    const getPickupDate = () => {
        const date = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
        return date.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleSimulatedPayment = (e) => {
        e.preventDefault();

        const newOrder = {
            number: Date.now(),
            date: new Date().toLocaleDateString('es-CL'),
            items: cartItems,
            total: getCartTotal(),
            customer: {
                name: formData.nombre,
                surname: formData.apellidos,
                email: formData.email,
                phone: formData.telefono,
            },
            shipping: deliveryMethod === 'despacho' ? {
                calle: formData.calle,
                numero: formData.numero,
                comuna: formData.comuna,
                region: formData.region,
                recibe: `${formData.recibeNombre} ${formData.recibeApellido}`
            } : {
                type: 'Retiro en Tienda'
            }
        };

        if (currentUser) {
            const updatedUser = addOrderToUser(currentUser.email, newOrder);
            updateCurrentUser(updatedUser);
        } else {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
        }

        clearCart();

        setModalInfo({
            show: true,
            title: '¡Compra Exitosa!',
            message: `¡Gracias por tu compra, ${formData.nombre}! Tu pedido #${newOrder.number} ha sido realizado con éxito.`
        });
    };

    const handleModalClose = () => {
        setModalInfo({ show: false, title: '', message: '' });
        navigate('/pedidos');
    };

    const renderStep1 = () => (
        <Card>
            <Card.Body>
                <Card.Title>Paso 1: Tus datos</Card.Title>
                <Form>
                    <Row>
                        <Col md={6}><Form.Group className="form-group" controlId="nombre"><Form.Label>Nombre:</Form.Label><Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} isInvalid={!!errors.nombre} /><Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="form-group" controlId="apellidos"><Form.Label>Apellidos:</Form.Label><Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} isInvalid={!!errors.apellidos} /><Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback></Form.Group></Col>
                    </Row>
                    <Form.Group className="form-group" controlId="rut"><Form.Label>RUT:</Form.Label><Form.Control type="text" name="rut" value={formData.rut} onChange={handleChange} isInvalid={!!errors.rut} placeholder="12345678-K" /><Form.Control.Feedback type="invalid">{errors.rut}</Form.Control.Feedback></Form.Group>
                    <Row>
                        <Col md={7}><Form.Group className="form-group" controlId="email"><Form.Label>E-mail:</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} /><Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={5}><Form.Group className="form-group" controlId="telefono"><Form.Label>Teléfono:</Form.Label><Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} isInvalid={!!errors.telefono} placeholder="+56912345678" /><Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback></Form.Group></Col>
                    </Row>
                    <div className="text-end">
                        <Button className="btn" onClick={nextStep}>Continuar</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
    const renderStep2 = () => (
        <Card>
            <Card.Body>
                <Card.Title>Paso 2: Forma de entrega</Card.Title>
                <Form>
                    <Form.Group className="form-group">
                        <Form.Check type="radio" name="deliveryMethod" id="despacho" label="Despacho a Domicilio" value="despacho" checked={deliveryMethod === 'despacho'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                        <Form.Check type="radio" name="deliveryMethod" id="retiro" label="Retiro en Tienda" value="retiro" checked={deliveryMethod === 'retiro'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                    </Form.Group>
                    {deliveryMethod === 'despacho' ? (
                        <>
                            <h5>Dirección de entrega:</h5>
                            {currentUser && savedAddresses.length > 0 && (
                                <Row className="mb-3">
                                    {savedAddresses.map(addr => (
                                        <Col md={6} key={addr.id} className="mb-2">
                                            <Card className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`} onClick={() => handleSelectAddress(addr)}>
                                                <Card.Body>
                                                    <strong>{addr.alias}</strong><br />
                                                    {addr.calle} {addr.numero}<br />
                                                    {addr.comuna}, {addr.region}<br />
                                                    Recibe: {addr.recibeNombre} {addr.recibeApellido}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            {currentUser && savedAddresses.length > 0 && selectedAddressId !== 'new' && (
                                <Button variant="outline-primary" size="sm" className="mb-3" onClick={() => { setSelectedAddressId('new'); setFormData(initialFormState); }}>
                                    Usar otra dirección
                                </Button>
                            )}
                            {(!currentUser || savedAddresses.length === 0 || selectedAddressId === 'new') && (
                                <>
                                    <Row>
                                        <Col md={6}><Form.Group className="form-group" controlId="region"><Form.Label>Región:</Form.Label><Form.Select name="region" value={formData.region} onChange={handleRegionChange} isInvalid={!!errors.region}><option value="">Selecciona una región</option>{regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback></Form.Group></Col>
                                        <Col md={6}><Form.Group className="form-group" controlId="comuna"><Form.Label>Comuna:</Form.Label><Form.Select name="comuna" value={formData.comuna} onChange={handleChange} isInvalid={!!errors.comuna} disabled={comunas.length === 0}><option value="">Selecciona una comuna</option>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback></Form.Group></Col>
                                    </Row>
                                    <Row>
                                        <Col md={8}><Form.Group className="form-group" controlId="calle"><Form.Label>Calle:</Form.Label><Form.Control type="text" name="calle" value={formData.calle} onChange={handleChange} isInvalid={!!errors.calle} /><Form.Control.Feedback type="invalid">{errors.calle}</Form.Control.Feedback></Form.Group></Col>
                                        <Col md={4}><Form.Group className="form-group" controlId="numero"><Form.Label>Número:</Form.Label><Form.Control type="text" name="numero" value={formData.numero} onChange={handleChange} isInvalid={!!errors.numero} /><Form.Control.Feedback type="invalid">{errors.numero}</Form.Control.Feedback></Form.Group></Col>
                                    </Row>
                                    <Form.Group className="form-group" controlId="depto"><Form.Label>N° Depto / Oficina (Opcional):</Form.Label><Form.Control type="text" name="depto" value={formData.depto} onChange={handleChange} /></Form.Group>
                                    <hr />
                                    <h5>Datos de Quien Recibe</h5>
                                    <Row>
                                        <Col md={6}><Form.Group className="form-group" controlId="recibeNombre"><Form.Label>Nombre:</Form.Label><Form.Control type="text" name="recibeNombre" value={formData.recibeNombre} onChange={handleChange} isInvalid={!!errors.recibeNombre} /><Form.Control.Feedback type="invalid">{errors.recibeNombre}</Form.Control.Feedback></Form.Group></Col>
                                        <Col md={6}><Form.Group className="form-group" controlId="recibeApellido"><Form.Label>Apellido:</Form.Label><Form.Control type="text" name="recibeApellido" value={formData.recibeApellido} onChange={handleChange} isInvalid={!!errors.recibeApellido} /><Form.Control.Feedback type="invalid">{errors.recibeApellido}</Form.Control.Feedback></Form.Group></Col>
                                    </Row>
                                    <Form.Group className="form-group" controlId="recibeTelefono"><Form.Label>Teléfono:</Form.Label><Form.Control type="tel" name="recibeTelefono" value={formData.recibeTelefono} onChange={handleChange} isInvalid={!!errors.recibeTelefono} /><Form.Control.Feedback type="invalid">{errors.recibeTelefono}</Form.Control.Feedback></Form.Group>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <h5>Retiro en Tienda</h5>
                            <Alert variant="info">
                                <p>Puedes retirar tu pedido en nuestra tienda principal:</p>
                                <p><strong>Dirección:</strong> Calle Falsa 123, Springfield</p>
                                <p><strong>Región:</strong> Metropolitana de Santiago</p>
                                <p><strong>Comuna:</strong> Santiago</p>
                                <p><strong>Fecha estimada de retiro:</strong> {getPickupDate()}</p>
                            </Alert>
                        </>
                    )}
                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={prevStep}>Volver</Button>
                        <Button className="btn" onClick={nextStep}>Continuar</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );

    const renderStep3 = () => (
        <Card>
            <Card.Body>
                <Card.Title>Paso 3: Resumen y Pago</Card.Title>
                <Row>
                    <Col md={7}>
                        <h5>Resumen del Pedido</h5>
                        {cartItems.map(item => (
                            <div key={item.codigo} className="d-flex justify-content-between my-2">
                                <span style={{ color: '#D3D3D3' }}>
                                    {item.nombre} (x{item.quantity} - ${item.precio.toLocaleString('es-CL')} c/u)
                                </span>

                                <strong>${(item.price * item.quantity).toLocaleString('es-CL')}</strong>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between h4">
                            <span>Total:</span>
                            <strong>${getCartTotal().toLocaleString('es-CL')}</strong>
                        </div>

                        <hr />
                        <h5>Datos Personales</h5>
                        <p>{formData.nombre} {formData.apellidos} ({formData.email})</p>

                        <h5>Entrega</h5>
                        {deliveryMethod === 'despacho' ? (
                            <p>Despacho a: {formData.calle} {formData.numero}, {formData.comuna}, {formData.region}</p>
                        ) : (
                            <p>Retiro en Tienda: Calle Falsa 123, Santiago</p>
                        )}
                    </Col>
                    <Col md={5}>
                        <h5>Método de Pago (Simulado)</h5>
                        <div>
                            <Form.Group className="form-group">
                                <Form.Label>Método de Pago</Form.Label>
                                <Form.Select defaultValue="webpay">
                                    <option value="webpay">Webpay (Simulación)</option>
                                    <option value="transferencia">Transferencia (Simulación)</option>
                                </Form.Select>
                            </Form.Group>
                            <Button onClick={handleSimulatedPayment} className="btn w-100">
                                Realizar Pedido y Pagar
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Button variant="secondary" onClick={prevStep} className="mt-3">Volver</Button>
            </Card.Body>
        </Card>
    );

    return (
        <>
            <main className="form-container">
                <Container>
                    <h2 className="section-title">Finalizar Compra</h2>
                    <Nav variant="pills" justify className="mb-4">
                        <Nav.Item><Nav.Link active={step === 1} disabled={step < 1} onClick={() => step > 1 && setStep(1)}>1. Tus datos</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link active={step === 2} disabled={step < 2} onClick={() => step > 2 && setStep(2)}>2. Forma de entrega</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link active={step === 3} disabled={step < 3}>3. Resumen y Pago</Nav.Link></Nav.Item>
                    </Nav>

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
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

export default CheckoutPage;