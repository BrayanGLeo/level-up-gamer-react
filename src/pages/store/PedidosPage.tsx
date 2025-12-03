import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderDetailModal from '../../components/OrderDetailModal';
import { getMyOrdersApi } from '../../utils/api';
import '../../styles/Perfil.css';
import { Order } from '../../data/userData';

const PedidosPage = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (currentUser) {
            const fetchOrders = async () => {
                try {
                    const data = await getMyOrdersApi();

                    const mappedOrders = data.map((boleta: any) => ({
                        number: boleta.numeroOrden,
                        date: new Date(boleta.fechaCompra).toLocaleDateString(),
                        total: boleta.total,
                        status: boleta.estado,

                        displayAddress: boleta.tipoEntrega === 'Retiro en Tienda'
                            ? 'Retiro en Tienda'
                            : (boleta.direccionEnvio || 'Dirección no disponible'),

                        customer: {
                            name: boleta.usuario ? boleta.usuario.nombre : (boleta.nombreCliente || 'Invitado'),
                            surname: boleta.usuario ? boleta.usuario.apellido : (boleta.apellidoCliente || ''),
                            email: boleta.usuario ? boleta.usuario.email : 'No registrado',
                            phone: boleta.telefonoCliente || 'No registrado'
                        },

                        shipping: boleta.tipoEntrega === 'Retiro en Tienda'
                            ? { type: 'Retiro en Tienda' }
                            : {
                                type: 'Despacho',
                                direccionCompleta: boleta.direccionEnvio,
                                ...boleta
                            },

                        items: boleta.detalles.map((d: any) => ({
                            codigo: d.producto.codigo,
                            nombre: d.producto.nombre,
                            quantity: d.cantidad,
                            precio: d.precioUnitario,
                            imagen: d.producto.imagenUrl
                        }))
                    }));

                    setOrders(mappedOrders.sort((a: any, b: any) => b.number - a.number));
                } catch (error) {
                    console.error("Error cargando pedidos:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const handleShowModal = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) return <Container className="pt-5 mt-5 text-center"><Spinner animation="border" /></Container>;

    if (!currentUser) {
        return (
            <main className="main-content" style={{ paddingTop: '100px' }}>
                <Container className="text-center">
                    <p>Inicia sesión para ver tu historial de pedidos.</p>
                    <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
                </Container>
            </main>
        );
    }

    return (
        <>
            <main className="main-content" style={{ paddingTop: '100px', minHeight: '80vh' }}>
                <section className="orders-section">
                    <Container>
                        <h2 className="section-title">Mis Pedidos</h2>

                        {orders.length === 0 ? (
                            <div className="text-center">
                                <p className="text-secondary">Aún no has realizado ningún pedido.</p>
                                <Link to="/catalogo" className="btn">Ir a comprar</Link>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover variant="dark" className="order-table align-middle">
                                    <thead>
                                        <tr>
                                            <th>N° Orden</th>
                                            <th>Dirección de Envío</th>
                                            <th>Total</th>
                                            <th className="text-center">Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(orders as any[]).map(order => (
                                            <tr key={order.number}>
                                                <td>
                                                    <strong>#{order.number}</strong>
                                                    <br />
                                                    <small className="text-muted">{order.date}</small>
                                                </td>
                                                <td>{order.displayAddress}</td>
                                                <td style={{ color: '#39FF14', fontWeight: 'bold' }}>
                                                    ${order.total.toLocaleString('es-CL')}
                                                </td>
                                                <td className="text-center">
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
                            </div>
                        )}
                    </Container>
                </section>
            </main>

            <OrderDetailModal show={showModal} onHide={handleCloseModal} order={selectedOrder} />
        </>
    );
};

export default PedidosPage;