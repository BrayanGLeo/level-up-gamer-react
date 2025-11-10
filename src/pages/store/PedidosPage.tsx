import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderDetailModal from '../../components/OrderDetailModal';
import '../../styles/Perfil.css';
import { Order } from '../../data/userData';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PedidosPage = () => {
    const { currentUser } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    let orders: Order[] = [];
    let noOrdersMessage = <p>Inicia sesión para ver tu historial de pedidos.</p>;

    if (currentUser) {
        orders = currentUser.orders || [];
        noOrdersMessage = <p>Aún no has realizado ningún pedido. ¡<Link to="/catalogo">Explora nuestro catálogo</Link> para empezar!</p>;
    }

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
        doc.text(`Teléfono: ${order.customer.phone}`, 14, 68);

        doc.setFontSize(16);
        doc.text("Datos de Envío", 14, 80);
        doc.setFontSize(12);
        if (order.shipping.type === 'Retiro en Tienda') {
            doc.text("Tipo de Entrega: Retiro en Tienda", 14, 88);
            doc.text("Dirección: Calle Falsa 123, Springfield", 14, 94);
        } else {
            doc.text("Tipo de Entrega: Despacho a Domicilio", 14, 88);
            doc.text(`Recibe: ${order.shipping.recibeNombre} ${order.shipping.recibeApellido}`, 14, 94);
            doc.text(`Dirección: ${order.shipping.calle} ${order.shipping.numero}${order.shipping.depto ? `, ${order.shipping.depto}` : ''}`, 14, 100);
            doc.text(`Comuna: ${order.shipping.comuna}, ${order.shipping.region}`, 14, 106);
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

                                                    <Button
                                                        className="btn btn-small ms-2"
                                                        variant="success"
                                                        onClick={() => handleDownloadBoleta(order)}
                                                    >
                                                        Descargar Boleta
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