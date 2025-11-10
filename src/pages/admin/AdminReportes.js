import React from 'react';
import { Card } from 'react-bootstrap';

const AdminReportes = () => {
    return (
        <>
            <div className="admin-page-header">
                <h1>Reportes</h1>
            </div>
            <Card className="admin-card">
                <Card.Body>
                    <div className="text-center p-5">
                        <span style={{ fontSize: '3rem' }}>📊</span>
                        <h3 className="mt-3">Módulo de Reportes</h3>
                        <p className="text-muted">
                            Esta sección está en desarrollo. Aquí podrás generar reportes
                            de ventas, ver productos más vendidos y más.
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default AdminReportes;