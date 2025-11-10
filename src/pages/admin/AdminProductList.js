import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProductByCode } from '../../data/productData';
import AdminConfirmModal from '../../components/AdminConfirmModal';
import '../../styles/AdminStyle.css'; 

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const handleDeleteClick = (codigo) => {
        setProductToDelete(codigo);
        setShowConfirmModal(true);
    };

    const handleModalClose = () => {
        setProductToDelete(null);
        setShowConfirmModal(false);
    };

    const handleModalConfirm = () => {
        if (productToDelete) {
            deleteProductByCode(productToDelete);
            setProducts(getProducts());
        }
        handleModalClose();
    };

    const getStockBadge = (stock, stockCritico) => {
        if (stock <= (stockCritico || 5)) {
            return <Badge bg="danger">Crítico ({stock})</Badge>;
        }
        if (stock < (stockCritico || 5) * 2) {
            return <Badge bg="warning">Bajo ({stock})</Badge>;
        }
        return <Badge bg="success">{stock}</Badge>;
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>Productos</h1>
                <Button as={Link} to="/admin/productos/nuevo" className="btn-admin">
                    Nuevo Producto
                </Button>
            </div>

            <Card className="admin-card">
                <Card.Header>Inventario de Productos</Card.Header>
                <Card.Body>
                    <div className="admin-table-container" style={{padding: 0, boxShadow: 'none'}}>
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.codigo}>
                                        <td><strong>{product.codigo}</strong></td>
                                        <td>{product.nombre}</td>
                                        <td>{product.categoria}</td>
                                        <td>${product.precio.toLocaleString('es-CL')}</td>
                                        <td>{getStockBadge(product.stock, product.stockCritico)}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => navigate(`/admin/productos/editar/${product.codigo}`)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => handleDeleteClick(product.codigo)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <AdminConfirmModal
                show={showConfirmModal}
                onHide={handleModalClose}
                onConfirm={handleModalConfirm}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que quieres eliminar este producto?"
            />
        </>
    );
};

export default AdminProductList;