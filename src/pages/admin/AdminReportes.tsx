import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { getUsers, Order } from '../../data/userData';
import { getProducts, Product } from '../../data/productData';
import '../../styles/AdminStyle.css';

interface TopSeller {
    codigo: string;
    nombre: string;
    quantity: number;
}

const AdminReportes = () => {
    const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
    const [lowStock, setLowStock] = useState<Product[]>([]);

    useEffect(() => {
        const products = getProducts();
        const users = getUsers();
        const allOrders: Order[] = users.flatMap(u => u.orders || []);

        const lowStockProducts = products
            .filter(p => p.stock <= (p.stockCritico || 5))
            .sort((a, b) => a.stock - b.stock);

        setLowStock(lowStockProducts);

        const salesCount: Record<string, number> = {};

        allOrders.forEach(order => {
            order.items.forEach(item => {
                salesCount[item.codigo] = (salesCount[item.codigo] || 0) + item.quantity;
            });
        });

        const topSellersList: TopSeller[] = Object.keys(salesCount)
            .map(codigo => {
                const product = products.find(p => p.codigo === codigo);
                return {
                    codigo: codigo,
                    nombre: product ? product.nombre : `Producto (ID: ${codigo})`,
                    quantity: salesCount[codigo]
                };
            })
            .sort((a, b) => b.quantity - a.quantity);

        setTopSellers(topSellersList);

    }, []);

    const getStockBadge = (stock: number, stockCritico: number) => {
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
                <h1>Reportes</h1>
            </div>

            <Row>
                <Col md={6} className="mb-4">
                    <Card className="admin-card h-100">
                        <Card.Header>Productos Más Vendidos</Card.Header>
                        <Card.Body>
                            <div className="admin-table-container" style={{ padding: 0, boxShadow: 'none' }}>
                                {topSellers.length === 0 ? (
                                    <p className="text-center p-3 text-muted">Aún no se han registrado ventas.</p>
                                ) : (
                                    <Table hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Unidades Vendidas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topSellers.map(product => (
                                                <tr key={product.codigo}>
                                                    <td><strong>{product.nombre}</strong></td>
                                                    <td>{product.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4">
                    <Card className="admin-card h-100">
                        <Card.Header>Productos con Stock Bajo</Card.Header>
                        <Card.Body>
                            <div className="admin-table-container" style={{ padding: 0, boxShadow: 'none' }}>
                                {lowStock.length === 0 ? (
                                    <p className="text-center p-3 text-muted">No hay productos con stock bajo.</p>
                                ) : (
                                    <Table hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Stock Actual</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lowStock.map(product => (
                                                <tr key={product.codigo}>
                                                    <td><strong>{product.nombre}</strong></td>
                                                    <td>{getStockBadge(product.stock, product.stockCritico)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminReportes;