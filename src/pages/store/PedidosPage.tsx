import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderDetailModal from '../../components/OrderDetailModal';
import { getMyOrdersApi } from '../../utils/api';
import '../../styles/Perfil.css';
import { Order } from '../../data/userData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
                        customer: {
                            name: boleta.usuario ? boleta.usuario.nombre : 'Invitado',
                            surname: boleta.usuario ? boleta.usuario.apellido : '',
                            email: boleta.usuario ? boleta.usuario.email : '',
                            phone: 'No registrado'
                        },
                        shipping: boleta.tipoEntrega === 'Retiro en Tienda' ? { type: 'Retiro en Tienda' } : { type: 'Despacho', ...boleta },
                        items: boleta.detalles.map((d: any) => ({
                            nombre: d.producto.nombre,
                            quantity: d.cantidad,
                            precio: d.precioUnitario,
                            imagen: d.producto.imagenUrl
                        }))
                    }));
                    setOrders(mappedOrders);
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

    const handleDownloadBoleta = (order: Order) => {
        const doc = new jsPDF();
        const formatPrice = (price: number) => `$${price.toLocaleString('es-CL')}`;

        doc.setFontSize(20);
        doc.text("Resumen de Compra", 14, 22);

        doc.setFontSize(12);
        doc.text(`N° de orden: ${order.number}`, 14, 30);
        doc.text(`Fecha de compra: ${order.date}`, 14, 36);

        doc.setFontSize(16);
        doc.text("Datos del Cliente", 14, 48);
        doc.setFontSize(12);
        doc.text(`Nombre: ${order.customer.name} ${order.customer.surname}`, 14, 56);
        doc.text(`E-mail: ${order.customer.email}`, 14, 62);
        doc.text(`Teléfono: ${order.customer.phone || 'No registrado'}`, 14, 68);

        doc.setFontSize(16);
        doc.text("Datos de Envío", 14, 80);
        doc.setFontSize(12);
        if (order.shipping.type === 'Retiro en Tienda') {
            doc.text("Tipo de Entrega: Retiro en Tienda", 14, 88);
            doc.text("Dirección: Calle Falsa 123, Springfield", 14, 94);
        } else {
            doc.text("Tipo de Entrega: Despacho a Domicilio", 14, 88);
            if (order.shipping.recibeNombre) {
                doc.text(`Recibe: ${order.shipping.recibeNombre} ${order.shipping.recibeApellido}`, 14, 94);
                doc.text(`Dirección: ${order.shipping.calle} ${order.shipping.numero}${order.shipping.depto ? `, ${order.shipping.depto}` : ''}`, 14, 100);
                doc.text(`Comuna: ${order.shipping.comuna}, ${order.shipping.region}`, 14, 106);
            } else {
                doc.text("Detalles de dirección no disponibles", 14, 94);
            }
        }

        const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];
        const tableRows: (string | number)[][] = [];

        order.items.forEach(item => {
            const itemData = [
                item.nombre,
                item.quantity,
                formatPrice(item.precio),
                formatPrice(item.precio * item.quantity)
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            startY: 115,
            head: [tableColumn],
            body: tableRows,
        });

        const finalY = (doc as any).lastAutoTable.finalY || 130;
        doc.setFontSize(18);
        doc.text(`Total: ${formatPrice(order.total)}`, 14, finalY + 15);

        doc.save(`boleta_${order.number}.pdf`);
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
            <main className="main-content" style={{ paddingTop: '100px' }}>
                <section className="orders-section">
                    <Container>
                        <h2 className="section-title">Mis Pedidos</h2>
                        {orders.length === 0 ? (
                            <p>Aún no has realizado ningún pedido. ¡<Link to="/catalogo">Explora nuestro catálogo</Link>!</p>
                        ) : (
                            <Table striped bordered hover responsive variant="dark" className="order-table">
                                <thead>
                                    <tr>
                                        <th>N° Orden</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.number}>
                                            <td>#{order.number}</td>
                                            <td>{order.date}</td>
                                            <td>${order.total.toLocaleString('es-CL')}</td>
                                            <td>{order.status}</td>
                                            <td>
                                                <Button size="sm" onClick={() => handleShowModal(order)}>Detalles</Button>
                                                <Button size="sm" variant="success" className="ms-2" onClick={() => handleDownloadBoleta(order)}>PDF</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Container>
                </section>
            </main>
            <OrderDetailModal show={showModal} onHide={handleCloseModal} order={selectedOrder} />
        </>
    );
};

export default PedidosPage;