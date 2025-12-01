import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { fetchApi } from '../../utils/api';
import OrderDetailModal from '../../components/OrderDetailModal';
import '../../styles/AdminStyle.css';

type AdminOrder = {
    number: number;
    date: string;
    total: number;
    status: string;
    clientName: string;
    userRUT: string;
    items: any[];
    shipping: any;
    id: number;
    customer: any;
};

const ESTADOS_ORDEN = ["Pendiente", "Procesando", "En preparación", "En tránsito", "Completado", "Cancelado"];

const AdminOrdenes = () => {
    const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchApi<any[]>('/ordenes', { method: 'GET' });

                const mapped = data.map(o => ({
                    id: o.id,
                    number: o.numeroOrden,
                    date: new Date(o.fechaCompra).toLocaleDateString(),
                    total: o.total,
                    status: o.estado,
                    clientName: o.usuario
                        ? `${o.usuario.nombre} ${o.usuario.apellido}`
                        : `${o.nombreCliente || 'Invitado'} ${o.apellidoCliente || ''}`,

                    userRUT: o.usuario ? o.usuario.rut : 'N/A',

                    customer: {
                        name: o.usuario ? o.usuario.nombre : (o.nombreCliente || 'Invitado'),
                        surname: o.usuario ? o.usuario.apellido : (o.apellidoCliente || ''),
                        email: o.usuario ? o.usuario.email : 'No registrado',
                    },

                    shipping: o.tipoEntrega === 'Retiro en Tienda'
                        ? { type: 'Retiro en Tienda' }
                        : {
                            type: 'Despacho',
                            direccionCompleta: o.direccionEnvio,
                            ...o
                        },

                    items: o.detalles.map((d: any) => ({
                        codigo: d.producto.codigo,
                        nombre: d.producto.nombre,
                        quantity: d.cantidad,
                        precio: d.precioUnitario,
                        imagen: d.producto.imagenUrl
                    }))
                }));

                setAllOrders(mapped.sort((a: any, b: any) => b.number - a.number));
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await fetchApi(`/ordenes/${id}/estado`, {
                method: 'PATCH',
                body: JSON.stringify({ estado: newStatus })
            });

            setAllOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Error al actualizar estado');
        }
    };

    const handleShowModal = (order: AdminOrder) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pendiente': return <Badge bg="secondary">{status}</Badge>;
            case 'Completado': return <Badge bg="success">{status}</Badge>;
            default: return <Badge bg="primary">{status}</Badge>;
        }
    };

    return (
        <>
            <div className="admin-page-header"><h1>Órdenes</h1></div>
            <Card className="admin-card">
                <Card.Body>
                    <Table hover responsive>
                        <thead>
                            <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acción</th><th>Detalle</th></tr>
                        </thead>
                        <tbody>
                            {allOrders.map(order => (
                                <tr key={order.number}>
                                    <td>#{order.number}</td>
                                    <td>{order.date}</td>
                                    <td>{order.clientName}</td>
                                    <td>${order.total.toLocaleString('es-CL')}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <Form.Select size="sm" value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                                            {ESTADOS_ORDEN.map(e => <option key={e} value={e}>{e}</option>)}
                                        </Form.Select>
                                    </td>
                                    <td><Button size="sm" onClick={() => handleShowModal(order)}>Ver</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <OrderDetailModal show={showModal} onHide={handleCloseModal} order={selectedOrder} />
        </>
    );
};

export default AdminOrdenes;