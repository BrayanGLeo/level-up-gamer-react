import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProductByCode } from '../../data/productData';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const handleDelete = (codigo) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            deleteProductByCode(codigo);
            setProducts(getProducts());
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1>Productos</h1>
                <Button as={Link} to="/admin/productos/nuevo" className="btn-admin">
                    Nuevo Producto
                </Button>
            </header>
            <section className="admin-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.codigo}>
                                <td>{product.codigo}</td>
                                <td>{product.nombre}</td>
                                <td>${product.precio.toLocaleString('es-CL')}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => navigate(`/admin/productos/editar/${product.codigo}`)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(product.codigo)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>
        </>
    );
};

export default AdminProductList;