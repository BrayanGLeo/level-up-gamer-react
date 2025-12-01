import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { getAdminProducts, deleteProduct } from '../../services/adminService';
import AdminConfirmModal from '../../components/AdminConfirmModal';
import '../../styles/AdminStyle.css';
import { Product } from '../../data/productData';

const AdminProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Error al cargar productos desde la API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteClick = (codigo: string) => {
        setProductToDelete(codigo);
        setShowConfirmModal(true);
    };

    const handleModalClose = () => {
        setProductToDelete(null);
        setShowConfirmModal(false);
    };

    const handleModalConfirm = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete);
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
        handleModalClose();
    };

    const getStockBadge = (stock: number, stockCritico: number) => {
        const critico = stockCritico || 5;
        if (stock <= critico) {
            return <Badge bg="danger">Crítico ({stock})</Badge>;
        }
        if (stock < critico * 2) {
            return <Badge bg="warning">Bajo ({stock})</Badge>;
        }
        return <Badge bg="success">{stock}</Badge>;
    };

    if (loading) {
        return <p className="text-center p-3">Cargando productos...</p>;
    }

    if (error) {
        return <p className="text-center p-3 text-danger">{error}</p>;
    }

    return (
        <>
            <div className="admin-page-header">
                <h1>Productos</h1>

                <LinkContainer to="/admin/productos/nuevo">
                    <Button className="btn-admin">
                        Nuevo Producto
                    </Button>
                </LinkContainer>
            </div>

            <Card className="admin-card">
                <Card.Header>Inventario de Productos</Card.Header>
                <Card.Body>
                    <div className="admin-table-container" style={{ padding: 0, boxShadow: 'none' }}>
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
                                        <td>{(product.categoria as any).nombre || product.categoria}</td>
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