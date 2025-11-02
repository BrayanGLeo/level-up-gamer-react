import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/Perfil.css';

const PedidosPage = () => {
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    return (
        <main className="main-content" style={{ paddingTop: '100px' }}>
            <section className="orders-section">
                <Container>
                    <h2 className="section-title">Mis Pedidos</h2>
                    
                    <div id="order-list-container">
                        {orders.length === 0 ? (
                            <p>Aún no has realizado ningún pedido. ¡<Link to="/catalogo">Explora nuestro catálogo</Link> para empezar!</p>
                        ) : (
                            <Table striped bordered hover responsive className="order-table" variant="dark">
                                <thead>
                                    <tr>
                                        <th>N° de Orden</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Cliente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.number}>
                                            <td>#{order.number}</td>
                                            <td>{order.date}</td>
                                            <td>${order.total.toLocaleString('es-CL')}</td>
                                            <td>{order.customer.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Container>
            </section>
        </main>
    );
};

export default PedidosPage;