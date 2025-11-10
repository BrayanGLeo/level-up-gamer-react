import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { getCategories, saveCategory, deleteCategory, Category } from '../../data/categoryData';
import AdminConfirmModal from '../../components/AdminConfirmModal';
import '../../styles/AdminStyle.css';

type CategoryFormState = {
    id: number | null;
    nombre: string;
}

const AdminCategorias = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const [currentCategory, setCurrentCategory] = useState<CategoryFormState>({ id: null, nombre: '' });
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        setCategories(getCategories());
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentCategory({ id: null, nombre: '' });
        setError('');
    };

    const handleShowCreateModal = () => {
        setIsEditMode(false);
        setCurrentCategory({ id: null, nombre: '' });
        setShowModal(true);
    };

    const handleShowEditModal = (category: Category) => {
        setIsEditMode(true);
        setCurrentCategory(category);
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCategory({ ...currentCategory, nombre: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentCategory.nombre.trim()) {
            setError('El nombre de la categoría no puede estar vacío.');
            return;
        }
        
        const existingCategory = categories.find(
            c => c.nombre.toLowerCase() === currentCategory.nombre.toLowerCase() && c.id !== currentCategory.id
        );
        
        if (existingCategory) {
            setError('Ya existe una categoría con ese nombre.');
            return;
        }

        saveCategory(currentCategory);
        loadCategories();
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setCategoryToDelete(id);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            deleteCategory(categoryToDelete);
            loadCategories();
        }
        setShowConfirmModal(false);
        setCategoryToDelete(null);
    };

    return (
        <>
            <div className="admin-page-header">
                <h1>Categorías</h1>
                <Button className="btn-admin" onClick={handleShowCreateModal}>
                    Nueva Categoría
                </Button>
            </div>
            <Card className="admin-card">
                <Card.Header>Lista de Categorías</Card.Header>
                <Card.Body>
                    <div className="admin-table-container" style={{padding: 0, boxShadow: 'none'}}>
                        {categories.length === 0 ? (
                            <p className="text-center p-3">No hay categorías creadas.</p>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.id}>
                                            <td>{cat.id}</td>
                                            <td><strong>{cat.nombre}</strong></td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => handleShowEditModal(cat)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    Eliminar
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

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="admin-form-container" style={{border:0}}>
                    <Modal.Title>{isEditMode ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="admin-form-container">
                        <Form.Group className="form-group" controlId="categoryName">
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={currentCategory.nombre}
                                onChange={handleChange}
                                isInvalid={!!error}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="admin-form-container" style={{border:0}}>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn-admin">
                            {isEditMode ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <AdminConfirmModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que quieres eliminar esta categoría? (Esto no afectará a los productos que ya la estén usando)."
            />
        </>
    );
};

export default AdminCategorias;