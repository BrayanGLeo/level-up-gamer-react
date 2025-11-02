import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { currentUser } = useAuth();

    return (
        <>
            <header className="admin-header">
                <h1>¡HOLA {currentUser.name}!</h1>
            </header>
            <section className="admin-dashboard">
                <h2>Resumen General</h2>
                <p>Bienvenido al panel de administración. Desde aquí podrás gestionar los productos y usuarios de la tienda.</p>
                {/* Aquí puedes añadir estadísticas como pide el nuevo diseño de la Eval 2 */}
            </section>
        </>
    );
};

export default AdminDashboard;