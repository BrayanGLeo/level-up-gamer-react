import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { getUsers, updateOrderStatus, Order, getGuestOrders } from '../../data/userData';
import OrderDetailModal from '../../components/OrderDetailModal';
import '../../styles/AdminStyle.css';

type AdminOrder = Order & {
    status: string;
    clientName: string;
    userRUT: string;
};

const ESTADOS_ORDEN: string[] = [
    "Pendiente",
    "Procesando",
    "En preparación",
    "En tránsito",
    "Completado"
];

const AdminOrdenes = () => {
    const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);


    useEffect(() => {
        const users = getUsers();

        const ordersFromAllUsers: AdminOrder[] = users.flatMap(user =>
            (user.orders || []).map((order: Order) => ({
                ...order,
                status: order.status || 'Pendiente',
                clientName: `${user.name} ${user.surname} (Registrado)`,
                userRUT: user.rut
            }))
        );

        const guestOrders = getGuestOrders();
        const ordersFromGuests: AdminOrder[] = guestOrders.map(order => ({
            ...order,
            status: order.status || 'Pendiente',
            clientName: `${order.customer.name} ${order.customer.surname} (Invitado)`,
            userRUT: 'invitado'
        }));

        const allCombinedOrders = [...ordersFromAllUsers, ...ordersFromGuests];
        allCombinedOrders.sort((a, b) => b.number - a.number);

        setAllOrders(allCombinedOrders);
    }, []);

    const handleShowModal = (order: AdminOrder) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = (userRUT: string, orderNumber: number, newStatus: string) => {
        updateOrderStatus(userRUT, orderNumber, newStatus);

        setAllOrders(prevOrders =>
            prevOrders.map(order =>
                order.number === orderNumber ? { ...order, status: newStatus } : order
            )
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pendiente':
                return <Badge bg="secondary">{status}</Badge>;
            case 'Procesando':
                return <Badge bg="primary">{status}</Badge>;
            case 'En preparación':
                return <Badge bg="info">{status}</Badge>;
            case 'En tránsito':
                return <Badge bg="warning">{status}</Badge>;
            case 'Completado':
                return <Badge bg="success">{status}</Badge>;
            default:
                return <Badge bg="dark">{status}</Badge>;
        }
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>Órdenes</h1>
            </div>

            <Card className="admin-card">
                <Card.Header>Historial de Órdenes</Card.Header>
                <Card.Body>
                    <div className="admin-table-container" style={{ padding: 0, boxShadow: 'none' }}>
                        {allOrders.length === 0 ? (
                            <div className="text-center p-5">
                                <span style={{ fontSize: '3rem' }}>🛒</span>
                                <h3 className="mt-3">No hay órdenes</h3>
                                <p className="text-muted">
                                    Aún no se ha realizado ninguna compra en la tienda.
                                </p>
                            </div>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>N° Orden</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Cambiar Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allOrders.map(order => (
                                        <tr key={order.number}>
                                            <td><strong>#{order.number}</strong></td>
                                            <td>{order.date}</td>
                                            <td>{order.clientName}</td>
                                            <td>${order.total.toLocaleString('es-CL')}</td>
                                            <td>{getStatusBadge(order.status!)}</td>
                                            <td>
                                                <Form.Select
                                                    size="sm"
                                                    value={order.status}
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(order.userRUT, order.number, e.target.value)}
                                                    className="admin-form-container"
                                                >
                                                    {ESTADOS_ORDEN.map(estado => (
                                                        <option key={estado} value={estado}>
                                                            {estado}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleShowModal(order)}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <OrderDetailModal
                show={showModal}
                onHide={handleCloseModal}
                order={selectedOrder}
            />
        </>
    );
};

export default AdminOrdenes;