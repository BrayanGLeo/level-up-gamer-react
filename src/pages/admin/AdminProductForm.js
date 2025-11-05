import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductByCode, saveProduct } from '../../data/productData';
import { validateProductForm } from '../../utils/validation';
import AdminNotificationModal from '../../components/AdminNotificationModal';

const AdminProductForm = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        stockCritico: 0,
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
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            saveProduct(formData);
            const message = isEditMode ? 'Producto actualizado con éxito' : 'Producto guardado con éxito';
            setModalInfo({ title: '¡Éxito!', message: message });
            setShowNotifyModal(true);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            </header>
            <section className="admin-form-container">
                <Form id="nuevoProductoForm" onSubmit={handleSubmit} noValidate>
                    {/* Código Producto */}
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

                    {/* Nombre */}
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

                    {/* Descripción */}
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

                    {/* Precio */}
                    <Form.Group className="form-group" controlId="precio">
                        <Form.Label>Precio:</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            isInvalid={!!errors.precio}
                        />
                        <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Stock */}
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

                    {/* Categoria */}
                    <Form.Group className="form-group" controlId="categoria">
                        <Form.Label>Categoría:</Form.Label>
                        <Form.Select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            isInvalid={!!errors.categoria}
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="juegos">Juegos de Mesa</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="consolas">Consolas</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="form-group" controlId="imagen">
                        <Form.Label>URL Imagen (Opcional):</Form.Label>
                        <Form.Control
                            type="text"
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button type="submit" className="btn-admin">
                        {isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
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

export default AdminProductForm;