import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductByCode, saveProduct } from '../../data/productData';
import { validateProductForm } from '../../utils/validation';
import AdminNotificationModal from '../../components/AdminNotificationModal';
import '../../styles/AdminStyle.css';

const AdminProductForm = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        stockCritico: 5, 
        categoria: '',
        imagen: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { codigo } = useParams();
    const isEditMode = Boolean(codigo);

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

    useEffect(() => {
        if (isEditMode) {
            const product = getProductByCode(codigo);
            if (product) {
                setFormData(product);
            }
        }
    }, [isEditMode, codigo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleModalClose = () => {
        setShowNotifyModal(false);
        navigate('/admin/productos');
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateProductForm(formData);

        if (!isEditMode) {
            const existingProduct = getProductByCode(formData.codigo);
            if (existingProduct) {
                formErrors.codigo = 'Este código de producto ya existe. Por favor, ingrese uno diferente.';
            }
        }
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            saveProduct(formData);
            const message = isEditMode ? 'Producto actualizado con éxito' : 'Producto guardado con éxito';
            setModalInfo({ title: '¡Éxito!', message: message });
            setShowNotifyModal(true);
        }
    };

    const handleCancel = () => {
        navigate('/admin/productos');
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            </div>

            <Card className="admin-card">
                <Card.Header>{isEditMode ? `Editando: ${formData.nombre}` : 'Detalles del Nuevo Producto'}</Card.Header>
                <Card.Body>
                    <Form id="nuevoProductoForm" onSubmit={handleSubmit} className="admin-form-container">
                        
                        <Row>
                            <Col md={4}>
                                <Form.Group className="form-group" controlId="codigo">
                                    <Form.Label>Código Producto:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleChange}
                                        readOnly={isEditMode}
                                        isInvalid={!!errors.codigo}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.codigo}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
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
                        </Row>

                        <Form.Group className="form-group" controlId="descripcion">
                            <Form.Label>Descripción (Opcional):</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="form-group" controlId="precio">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="1"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        isInvalid={!!errors.precio}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="form-group" controlId="stock">
                                    <Form.Label>Stock:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        isInvalid={!!errors.stock}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="form-group" controlId="stockCritico">
                                    <Form.Label>Stock Crítico (Opcional):</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stockCritico"
                                        value={formData.stockCritico}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="form-group" controlId="categoria">
                                    <Form.Label>Categoría:</Form.Label>
                                    <Form.Select
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        isInvalid={!!errors.categoria}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        <option value="juegos">Juegos</option>
                                        <option value="accesorios">Accesorios</option>
                                        <option value="consolas">Consolas y PC</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                             <Col md={6}>
                                <Form.Group className="form-group" controlId="imagen">
                                    <Form.Label>URL Imagen (Opcional):</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="imagen"
                                        value={formData.imagen}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-end mt-3">
                            <Button type="button" variant="secondary" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="btn-admin ms-2">
                                {isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <AdminNotificationModal
                show={showNotifyModal}
                onHide={handleModalClose}
                title={modalInfo.title}
                message={modalInfo.message}
            />
        </>
    );
};

export default AdminProductForm;