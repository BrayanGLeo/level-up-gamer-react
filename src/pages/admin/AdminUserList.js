import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUserByEmail } from '../../data/userData';
import '../../styles/AdminStyle.css';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const handleDelete = (email) => {
        if (email === 'admin@admin.cl') {
            alert('No puedes eliminar al administrador principal.');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            deleteUserByEmail(email);
            setUsers(getUsers());
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1>Usuarios</h1>
                <Button as={Link} to="/admin/usuarios/nuevo" className="btn-admin">
                    Nuevo Usuario
                </Button>
            </header>
            <section className="admin-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>RUN</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.email}>
                                <td>{user.run || 'N/A'}</td>
                                <td>{user.name} {user.surname}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => navigate(`/admin/usuarios/editar/${user.email}`)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(user.email)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>
        </>
    );
};

export default AdminUserList;