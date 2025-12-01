import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { getProductsApi, fetchApi } from '../../utils/api';
import '../../styles/AdminStyle.css';

interface TopSeller {
    codigo: string;
    nombre: string;
    quantity: number;
}

const AdminReportes = () => {
    const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
    const [lowStock, setLowStock] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getProductsApi();
                const low = products.filter(p => p.stock <= (p.stockCritico || 5));
                setLowStock(low);

                const allOrders = await fetchApi<any[]>('/ordenes', { method: 'GET' });
                
                const salesCount: Record<string, number> = {};
                allOrders.forEach((order: any) => {
                    order.detalles.forEach((detalle: any) => {
                        const cod = detalle.producto.codigo;
                        salesCount[cod] = (salesCount[cod] || 0) + detalle.cantidad;
                    });
                });

                const sellers = Object.keys(salesCount).map(cod => {
                    const prod = products.find(p => p.codigo === cod);
                    return {
                        codigo: cod,
                        nombre: prod ? prod.nombre : 'Desconocido',
                        quantity: salesCount[cod]
                    };
                }).sort((a, b) => b.quantity - a.quantity);

                setTopSellers(sellers);

            } catch (err) {
                console.error("Error loading reports", err);
            }
        };
        fetchData();
    }, []);

    const getStockBadge = (stock: number, stockCritico: number) => {
        if (stock <= (stockCritico || 5)) return <Badge bg="danger">Crítico ({stock})</Badge>;
        return <Badge bg="warning">Bajo ({stock})</Badge>;
    };

    return (
        <>
            <div className="admin-page-header"><h1>Reportes</h1></div>
            <Row>
                <Col md={6}>
                    <Card className="admin-card">
                        <Card.Header>Productos Más Vendidos</Card.Header>
                        <Card.Body>
                            <Table hover>
                                <thead><tr><th>Producto</th><th>Vendidos</th></tr></thead>
                                <tbody>
                                    {topSellers.map(p => (
                                        <tr key={p.codigo}><td>{p.nombre}</td><td>{p.quantity}</td></tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="admin-card">
                        <Card.Header>Stock Bajo</Card.Header>
                        <Card.Body>
                            <Table hover>
                                <thead><tr><th>Producto</th><th>Stock</th></tr></thead>
                                <tbody>
                                    {lowStock.map(p => (
                                        <tr key={p.codigo}><td>{p.nombre}</td><td>{getStockBadge(p.stock, p.stockCritico)}</td></tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminReportes;