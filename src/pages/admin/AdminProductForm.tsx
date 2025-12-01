import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductByCode, createProduct, updateProduct, getCategories } from '../../services/adminService';
import { validateProductForm } from '../../utils/validation';
import AdminNotificationModal from '../../components/AdminNotificationModal';
import '../../styles/AdminStyle.css';
import { Product, Specifications } from '../../data/productData';
import { Category } from '../../data/categoryData';

const initialFormState: Product = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stockCritico: 5,
    categoria: '',
    imagen: '',
    features: [],
    specifications: {}
};

const AdminProductForm = () => {
    const [formData, setFormData] = useState<Product>(initialFormState);
    interface FormErrors {
        codigo?: string;
        nombre?: string;
        precio?: string;
        stock?: string;
        categoria?: string;
    }

    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    const { codigo } = useParams();
    const isEditMode = Boolean(codigo);

    const [categories, setCategories] = useState<Category[]>([]);

    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

    const fetchProductData = async () => {
        try {
            const cats = await getCategories();
            setCategories(cats);

            if (isEditMode && codigo) {
                const product = await getProductByCode(codigo);
                if (product) {
                    setFormData({
                        ...product,
                        categoria: (product.categoria as any).nombre || product.categoria,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrors({ nombre: "Error al cargar datos iniciales o producto." });
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [isEditMode, codigo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleModalClose = () => {
        setShowNotifyModal(false);
        navigate('/admin/productos');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formErrors: FormErrors = validateProductForm(formData as any);

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {

            const productToSave: Product = {
                ...formData,
                precio: parseFloat(String(formData.precio)) || 0,
                stock: parseInt(String(formData.stock)) || 0,
                stockCritico: parseInt(String(formData.stockCritico)) || 5,
            };

            const selectedCategory = categories.find(c => c.nombre === productToSave.categoria);

            if (!selectedCategory) {
                setErrors({ categoria: "La categoría seleccionada es inválida." });
                return;
            }

            try {
                let message = '';
                if (isEditMode) {
                    await updateProduct(productToSave, selectedCategory);
                    message = 'Producto actualizado con éxito';
                } else {
                    await createProduct(productToSave, selectedCategory);
                    message = 'Producto guardado con éxito';
                }

                setModalInfo({ title: '¡Éxito!', message: message });
                setShowNotifyModal(true);

            } catch (error: any) {
                const errorMessage = error.message.includes("ProductoController") ?
                    "Error de código de producto duplicado o falta de datos." :
                    error.message;
                setModalInfo({ title: 'Error', message: errorMessage });
                setShowNotifyModal(true);
            }
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
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.nombre}>
                                                {cat.nombre}
                                            </option>
                                        ))}
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