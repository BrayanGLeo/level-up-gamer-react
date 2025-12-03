import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Nav, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { regionesData } from '../../data/chileData';
import { Address } from '../../data/userData';
import { finalizeCheckoutApi, getMyAddressesApi, createAddressApi } from '../../utils/api';
import { validateRut, validateBasicEmail, validatePhone, validateRequiredField } from '../../utils/validation';
import NotificationModal from '../../components/NotificationModal';
import '../../styles/Forms.css';
import '../../styles/Checkout.css';

interface ICheckoutForm {
    nombre: string; apellidos: string; rut: string; email: string; telefono: string;
    region: string; comuna: string; calle: string; numero: string; depto: string;
    recibeNombre: string; recibeApellido: string; recibeTelefono: string;
}

const initialFormState: ICheckoutForm = {
    nombre: '', apellidos: '', rut: '', email: '', telefono: '',
    region: '', comuna: '', calle: '', numero: '', depto: '',
    recibeNombre: '', recibeApellido: '', recibeTelefono: ''
};

const initialAddressState: Partial<ICheckoutForm> = {
    region: '', comuna: '', calle: '', numero: '', depto: '',
    recibeNombre: '', recibeApellido: '', recibeTelefono: ''
};

const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ICheckoutForm>(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [comunas, setComunas] = useState<string[]>([]);
    const { currentUser } = useAuth();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | string | null>(null);
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                nombre: currentUser.name,
                apellidos: currentUser.surname,
                email: currentUser.email,
                rut: currentUser.rut || '',
            }));

            const fetchAddresses = async () => {
                try {
                    const addrs = await getMyAddressesApi();
                    setSavedAddresses(addrs);
                } catch (err) {
                    console.error("Error cargando direcciones", err);
                }
            };
            fetchAddresses();
        }
    }, [currentUser]);

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!validateRequiredField(formData.nombre, 50)) newErrors.nombre = 'El nombre es requerido.';
        if (!validateRequiredField(formData.apellidos, 100)) newErrors.apellidos = 'El apellido es requerido.';
        if (!validateRut(formData.rut)) newErrors.rut = 'El RUT no es válido.';
        if (!validateBasicEmail(formData.email)) newErrors.email = 'El E-mail no es válido.';
        if (!validatePhone(formData.telefono)) newErrors.telefono = 'El teléfono no es válido.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!deliveryMethod) newErrors.deliveryMethod = 'Debes seleccionar una forma de entrega.';
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

    const validateStep3 = () => {
        if (!paymentMethod) {
            setPaymentError('Por favor selecciona un método de pago.');
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSelectedAddressId('new');
    };
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const regionNombre = e.target.value;
        setFormData({ ...formData, region: regionNombre, comuna: '' });
        const found = regionesData.find(r => r.nombre === regionNombre);
        setComunas(found ? found.comunas : []);
        setSelectedAddressId('new');
    };

    const handleSelectAddress = (address: Address) => {
        setFormData(prev => ({
            ...prev,
            region: address.region,
            comuna: address.comuna,
            calle: address.calle,
            numero: address.numero,
            depto: address.depto || '',
            recibeNombre: address.recibeNombre,
            recibeApellido: address.recibeApellido,
            recibeTelefono: address.recibeTelefono
        }));
        setSelectedAddressId(address.id);
        const found = regionesData.find(r => r.nombre === address.region);
        setComunas(found ? found.comunas : []);
        setErrors({});
    };

    const handleSaveAddress = async () => {
        if (!validateStep2()) return;
        const newAddress = {
            alias: `${formData.calle} ${formData.numero}`,
            region: formData.region,
            comuna: formData.comuna,
            calle: formData.calle,
            numero: formData.numero,
            depto: formData.depto,
            recibeNombre: formData.recibeNombre,
            recibeApellido: formData.recibeApellido,
            recibeTelefono: formData.recibeTelefono
        };
        try {
            const savedAddr = await createAddressApi(newAddress);
            setSavedAddresses([...savedAddresses, savedAddr]);
            setSelectedAddressId(savedAddr.id);
            setModalInfo({ show: true, title: 'Dirección Guardada', message: 'La dirección se ha guardado.' });
        } catch (error) {
            setModalInfo({ show: true, title: 'Error', message: 'No se pudo guardar la dirección.' });
        }
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

    const handlePayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setIsProcessing(true);
        setPaymentError('');

        let direccionEnvioTexto = '';
        if (deliveryMethod === 'despacho') {
            direccionEnvioTexto = `${formData.calle} #${formData.numero}, ${formData.comuna}, ${formData.region}`;
            if (formData.depto) direccionEnvioTexto += `, Depto ${formData.depto}`;
            direccionEnvioTexto += ` | Recibe: ${formData.recibeNombre} ${formData.recibeApellido} (${formData.recibeTelefono})`;
        } else {
            direccionEnvioTexto = 'Retiro en Tienda (Calle Falsa 123, Springfield)';
        }

        const boletaRequest = {
            usuarioEmail: currentUser?.email || null,
            total: getCartTotal(),
            tipoEntrega: deliveryMethod === 'despacho' ? 'Despacho a Domicilio' : 'Retiro en Tienda',
            estado: 'Pagado',
            metodoPago: paymentMethod,

            nombreCliente: formData.nombre,
            apellidoCliente: formData.apellidos,
            telefonoCliente: formData.telefono,
            direccionEnvio: direccionEnvioTexto,

            items: cartItems.map(item => ({
                codigoProducto: item.codigo,
                cantidad: item.quantity,
                precioUnitario: item.precio
            }))
        };

        try {
            const response = await finalizeCheckoutApi(boletaRequest);

            const successOrder = {
                number: response.numeroOrden,
                date: new Date().toLocaleDateString(),
                total: boletaRequest.total,
                items: cartItems,
                customer: { name: formData.nombre, surname: formData.apellidos, email: formData.email, phone: formData.telefono },
                shipping: deliveryMethod === 'despacho' ? {
                    type: 'Despacho a Domicilio',
                    calle: formData.calle, numero: formData.numero, depto: formData.depto,
                    comuna: formData.comuna, region: formData.region,
                    recibeNombre: formData.recibeNombre, recibeApellido: formData.recibeApellido
                } : { type: 'Retiro en Tienda' }
            };

            clearCart();
            navigate('/compra-exitosa', { state: { order: successOrder } });

        } catch (error: any) {
            console.error("Error en checkout", error);
            alert(`Error al procesar la compra: ${error.message}`);
            setPaymentError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleModalClose = () => setModalInfo({ show: false, title: '', message: '' });

    const renderStep1 = () => (
        <Card>
            <Card.Body>
                <Card.Title>Paso 1: Tus datos</Card.Title>
                <Form noValidate>
                    <Row>
                        <Col md={6}><Form.Group className="form-group" controlId="nombre"><Form.Label>Nombre:</Form.Label><Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} isInvalid={!!errors.nombre} required /></Form.Group></Col>
                        <Col md={6}><Form.Group className="form-group" controlId="apellidos"><Form.Label>Apellidos:</Form.Label><Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} isInvalid={!!errors.apellidos} required /></Form.Group></Col>
                    </Row>
                    <Form.Group className="form-group" controlId="rut"><Form.Label>RUT:</Form.Label><Form.Control type="text" name="rut" value={formData.rut} onChange={handleChange} isInvalid={!!errors.rut} placeholder="12345678-K" required readOnly={!!currentUser} /><Form.Control.Feedback type="invalid">{errors.rut}</Form.Control.Feedback></Form.Group>
                    <Row>
                        <Col md={7}><Form.Group className="form-group" controlId="email"><Form.Label>E-mail:</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} required /><Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={5}><Form.Group className="form-group" controlId="telefono"><Form.Label>Teléfono:</Form.Label><Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} isInvalid={!!errors.telefono} placeholder="+56912345678" required /><Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback></Form.Group></Col>
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
                <Form noValidate>
                    <Form.Group className="form-group delivery-method-group">
                        <Form.Check type="radio" name="deliveryMethod" id="despacho" value="despacho" checked={deliveryMethod === 'despacho'} onChange={(e) => setDeliveryMethod(e.target.value)} className={deliveryMethod === 'despacho' ? 'active' : ''} label="Despacho a Domicilio" />
                        <Form.Check type="radio" name="deliveryMethod" id="retiro" value="retiro" checked={deliveryMethod === 'retiro'} onChange={(e) => setDeliveryMethod(e.target.value)} className={deliveryMethod === 'retiro' ? 'active' : ''} label="Retiro en Tienda" />
                        {!!errors.deliveryMethod && <div className="invalid-feedback d-block">{errors.deliveryMethod}</div>}
                    </Form.Group>

                    {deliveryMethod === 'despacho' && (
                        <>
                            <hr />
                            <h5>Dirección de entrega:</h5>
                            {currentUser && savedAddresses.length > 0 && (
                                <Row className="mb-3">
                                    {savedAddresses.map(addr => (
                                        <Col md={6} key={addr.id} className="mb-2">
                                            <Card className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`} onClick={() => handleSelectAddress(addr)}>
                                                <Card.Body>
                                                    <strong>{addr.alias}</strong><br />
                                                    {addr.calle} {addr.numero}, {addr.comuna}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {currentUser && savedAddresses.length > 0 && selectedAddressId !== 'new' && (
                                <Button variant="outline-primary" size="sm" className="mb-3" onClick={() => {
                                    setSelectedAddressId('new');
                                    setFormData(prev => ({ ...prev, ...initialAddressState }));
                                    setErrors({});
                                }}>Usar otra dirección</Button>
                            )}

                            {(!currentUser || savedAddresses.length === 0 || selectedAddressId === 'new') && (
                                <>
                                    <Row>
                                        <Col md={6}><Form.Group className="form-group" controlId="region"><Form.Label>Región:</Form.Label><Form.Select name="region" value={formData.region} onChange={handleRegionChange} isInvalid={!!errors.region} required><option value="">Selecciona una región</option>{regionesData.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.region}</Form.Control.Feedback></Form.Group></Col>
                                        <Col md={6}><Form.Group className="form-group" controlId="comuna"><Form.Label>Comuna:</Form.Label><Form.Select name="comuna" value={formData.comuna} onChange={handleChange} isInvalid={!!errors.comuna} disabled={comunas.length === 0} required><option value="">Selecciona una comuna</option>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.comuna}</Form.Control.Feedback></Form.Group></Col>
                                    </Row>
                                    <Row>
                                        <Col md={8}><Form.Group className="form-group" controlId="calle"><Form.Label>Calle:</Form.Label><Form.Control type="text" name="calle" value={formData.calle} onChange={handleChange} isInvalid={!!errors.calle} required /><Form.Control.Feedback type="invalid">{errors.calle}</Form.Control.Feedback></Form.Group></Col>
                                        <Col md={4}><Form.Group className="form-group" controlId="numero"><Form.Label>Número:</Form.Label><Form.Control type="text" name="numero" value={formData.numero} onChange={handleChange} isInvalid={!!errors.numero} required /><Form.Control.Feedback type="invalid">{errors.numero}</Form.Control.Feedback></Form.Group></Col>
                                    </Row>
                                    <Form.Group className="form-group" controlId="depto"><Form.Label>N° Depto (Opcional):</Form.Label><Form.Control type="text" name="depto" value={formData.depto} onChange={handleChange} /></Form.Group>
                                    <hr />
                                    <h5>Datos de Quien Recibe</h5>
                                    <Row>
                                        <Col md={6}><Form.Group className="form-group" controlId="recibeNombre"><Form.Label>Nombre:</Form.Label><Form.Control type="text" name="recibeNombre" value={formData.recibeNombre} onChange={handleChange} isInvalid={!!errors.recibeNombre} required /><Form.Control.Feedback type="invalid">{errors.recibeNombre}</Form.Control.Feedback></Form.Group></Col>
                                        <Col md={6}><Form.Group className="form-group" controlId="recibeApellido"><Form.Label>Apellido:</Form.Label><Form.Control type="text" name="recibeApellido" value={formData.recibeApellido} onChange={handleChange} isInvalid={!!errors.recibeApellido} required /><Form.Control.Feedback type="invalid">{errors.recibeApellido}</Form.Control.Feedback></Form.Group></Col>
                                    </Row>
                                    <Form.Group className="form-group" controlId="recibeTelefono"><Form.Label>Teléfono:</Form.Label><Form.Control type="tel" name="recibeTelefono" value={formData.recibeTelefono} onChange={handleChange} isInvalid={!!errors.recibeTelefono} required /><Form.Control.Feedback type="invalid">{errors.recibeTelefono}</Form.Control.Feedback></Form.Group>

                                    {currentUser && (
                                        <Button variant="outline-success" size="sm" className="mb-3" onClick={handleSaveAddress}>
                                            Guardar dirección
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {deliveryMethod === 'retiro' && (
                        <Alert variant="info"><p>Puedes retirar en: Calle Falsa 123, Springfield</p></Alert>
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
                        <h5>Productos</h5>
                        {cartItems.map(item => (
                            <div key={item.codigo} className="d-flex justify-content-between my-2 border-bottom pb-2">
                                <span>{item.nombre} <small className="text-muted">(x{item.quantity})</small></span>
                                <strong>${(item.precio * item.quantity).toLocaleString('es-CL')}</strong>
                            </div>
                        ))}

                        <div className="d-flex justify-content-between mt-3">
                            <h4>Total:</h4>
                            <h4 style={{ color: '#39FF14' }}>${getCartTotal().toLocaleString('es-CL')}</h4>
                        </div>
                    </Col>

                    <Col md={5}>
                        <div className="mb-4 p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                            <h5 className="mb-3" style={{ color: '#1E90FF' }}>Datos de Envío</h5>
                            {deliveryMethod === 'despacho' ? (
                                <>
                                    <p className="mb-1"><strong>Dirección:</strong> {formData.calle} #{formData.numero} {formData.depto && `, Depto ${formData.depto}`}</p>
                                    <p className="mb-1"><strong>Comuna:</strong> {formData.comuna}, {formData.region}</p>
                                    <p className="mb-0"><strong>Recibe:</strong> {formData.recibeNombre} {formData.recibeApellido}</p>
                                </>
                            ) : (
                                <>
                                    <p className="mb-1"><strong>Retiro en Tienda</strong></p>
                                    <p className="mb-0">Calle Falsa 123, Springfield</p>
                                </>
                            )}
                        </div>

                        <h5 className="mb-3">Selecciona Método de Pago</h5>
                        <Form.Group className="mb-4">
                            <Card
                                className={`mb-2 p-2 ${paymentMethod === 'WebPay' ? 'border-primary' : ''}`}
                                style={{ cursor: 'pointer', backgroundColor: paymentMethod === 'WebPay' ? 'rgba(30, 144, 255, 0.1)' : 'transparent' }}
                                onClick={() => setPaymentMethod('WebPay')}
                            >
                                <Form.Check
                                    type="radio"
                                    id="webpay"
                                    label={<strong>WebPay Plus (Débito/Crédito)</strong>}
                                    name="payment"
                                    checked={paymentMethod === 'WebPay'}
                                    onChange={() => setPaymentMethod('WebPay')}
                                />
                            </Card>

                            <Card
                                className={`mb-2 p-2 ${paymentMethod === 'Transferencia' ? 'border-primary' : ''}`}
                                style={{ cursor: 'pointer', backgroundColor: paymentMethod === 'Transferencia' ? 'rgba(30, 144, 255, 0.1)' : 'transparent' }}
                                onClick={() => setPaymentMethod('Transferencia')}
                            >
                                <Form.Check
                                    type="radio"
                                    id="transferencia"
                                    label={<strong>Transferencia Bancaria</strong>}
                                    name="payment"
                                    checked={paymentMethod === 'Transferencia'}
                                    onChange={() => setPaymentMethod('Transferencia')}
                                />
                            </Card>
                        </Form.Group>

                        {paymentError && <Alert variant="danger" className="py-2">{paymentError}</Alert>}

                        <Button
                            onClick={handlePayment}
                            className="btn w-100 btn-lg"
                            disabled={isProcessing || !paymentMethod}
                        >
                            {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                        </Button>
                    </Col>
                </Row>

                <Button variant="secondary" onClick={prevStep} className="mt-3" disabled={isProcessing}>
                    Volver
                </Button>
            </Card.Body>
        </Card>
    );

    return (
        <main className="form-container">
            <Container>
                <h2 className="section-title">Finalizar Compra</h2>
                <Nav variant="pills" justify className="mb-4">
                    <Nav.Item><Nav.Link active={step === 1} disabled>1. Datos</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link active={step === 2} disabled>2. Entrega</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link active={step === 3} disabled>3. Pago</Nav.Link></Nav.Item>
                </Nav>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </Container>
            <NotificationModal show={modalInfo.show} onHide={handleModalClose} title={modalInfo.title} message={modalInfo.message} />
        </main>
    );
};

export default CheckoutPage;