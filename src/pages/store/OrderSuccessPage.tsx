import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../../data/userData';

interface LocationState {
    order: Order;
}

const OrderSuccessPage = () => {
    const location = useLocation();
    const order = (location.state as LocationState | null)?.order;

    const handleDownloadBoleta = (orderToDownload: Order | undefined | null) => {
        if (!orderToDownload) return;

        const doc = new jsPDF();
        const formatPrice = (price: number) => `$${price.toLocaleString('es-CL')}`;

        doc.setFontSize(20);
        doc.text("Resumen de Compra", 14, 22);
        doc.setFontSize(12);
        doc.text(`N° de orden: ${orderToDownload.number}`, 14, 30);
        doc.text(`Fecha de compra: ${orderToDownload.date}`, 14, 36);

        doc.setFontSize(16);
        doc.text("Datos del Cliente", 14, 48);
        doc.setFontSize(12);
        doc.text(`Nombre: ${orderToDownload.customer.name} ${orderToDownload.customer.surname}`, 14, 56);
        doc.text(`E-mail: ${orderToDownload.customer.email}`, 14, 62);
        doc.text(`Teléfono: ${orderToDownload.customer.phone}`, 14, 68);

        doc.setFontSize(16);
        doc.text("Datos de Envío", 14, 80);
        doc.setFontSize(12);
        if (orderToDownload.shipping.type === 'Retiro en Tienda') {
            doc.text("Tipo de Entrega: Retiro en Tienda", 14, 88);
            doc.text("Dirección: Calle Falsa 123, Springfield", 14, 94);
        } else {
            doc.text("Tipo de Entrega: Despacho a Domicilio", 14, 88);
            doc.text(`Recibe: ${orderToDownload.shipping.recibeNombre} ${orderToDownload.shipping.recibeApellido}`, 14, 94);
            doc.text(`Dirección: ${orderToDownload.shipping.calle} ${orderToDownload.shipping.numero}${orderToDownload.shipping.depto ? `, ${orderToDownload.shipping.depto}` : ''}`, 14, 100);
            doc.text(`Comuna: ${orderToDownload.shipping.comuna}, ${orderToDownload.shipping.region}`, 14, 106);
        }

        const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];
        const tableRows: (string | number)[] [] = [];

        orderToDownload.items.forEach(item => {
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
        doc.text(`Total: ${formatPrice(orderToDownload.total)}`, 14, finalY + 15);

        doc.save(`boleta_${orderToDownload.number}.pdf`);
    };

    if (!order) {
        return (
            <Container style={{ paddingTop: '100px', minHeight: '70vh' }}>
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>No se encontró información del pedido.</p>
                </Alert>
                <LinkContainer to="/catalogo">
                    <Button variant="primary">Volver a la tienda</Button>
                </LinkContainer>
            </Container>
        );
    }

    return (
        <Container style={{ paddingTop: '100px', minHeight: '70vh' }}>
            <Alert variant="success">
                <Alert.Heading>¡Pago Correcto!</Alert.Heading>
                <p>
                    Tu pedido ha sido realizado con éxito.
                    {order && ` Tu número de pedido es #${order.number}.`}
                </p>
                <hr />
                <p className="mb-0">
                    ¡Gracias por preferir Level-Up Gamer!
                </p>
            </Alert>

            <div className="d-flex justify-content-start gap-2">
                
                <LinkContainer to="/catalogo">
                    <Button variant="primary">
                        Seguir comprando
                    </Button>
                </LinkContainer>

                {order && (
                    <Button variant="success" onClick={() => handleDownloadBoleta(order)}>
                        Descargar Boleta
                    </Button>
                )}
            </div>
        </Container>
    );
};

export default OrderSuccessPage;