import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderDetailModal from '../../components/OrderDetailModal';
import '../../styles/Perfil.css';

const PedidosPage = () => {

    const { currentUser } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    let orders = [];
    let noOrdersMessage = <p>Inicia sesión para ver tu historial de pedidos.</p>;

    if (currentUser) {
        orders = currentUser.orders || [];
        noOrdersMessage = <p>Aún no has realizado ningún pedido. ¡<Link to="/catalogo">Explora nuestro catálogo</Link> para empezar!</p>;
    }

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <main className="main-content" style={{ paddingTop: '100px' }}>
                <section className="orders-section">
                    <Container>
                        <h2 className="section-title">Mis Pedidos</h2>

                        <div id="order-list-container">
                            {orders.length === 0 ? (
                                noOrdersMessage
                            ) : (
                                <Table striped bordered hover responsive className="order-table" variant="dark">
                                    <thead>
                                        <tr>
                                            <th>N° de Orden</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Cliente</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.number}>
                                                <td>#{order.number}</td>
                                                <td>{order.date}</td>
                                                <td>${order.total.toLocaleString('es-CL')}</td>
                                                <td>{order.customer.name}</td>
                                                <td>
                                                    <Button
                                                        className="btn btn-small"
                                                        onClick={() => handleShowModal(order)}
                                                    >
                                                        Detalles
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Container>
                </section>
            </main>

            <OrderDetailModal
                show={showModal}
                onHide={handleCloseModal}
                order={selectedOrder}
            />
        </>
    );
};

export default PedidosPage;