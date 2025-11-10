import React, { useState } from 'react';
import { Container, Row, Col, Form, Dropdown } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../data/productData';
import '../../styles/Catalogo.css';
import { useCart } from '../../context/CartContext';
import AddToCartModal from '../../components/AddToCartModal';

const categories = ['todos', 'juegos', 'accesorios', 'consolas'];

const CatalogoPage = () => {
    const allProducts = getProducts();
    const { addToCart } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleCloseModal = () => setShowModal(false);

    const handleAddToCart = (product) => {
        addToCart(product);
        setSelectedProduct(product);
        setShowModal(true);
    };

    const filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategory === 'todos' || product.categoria.toLowerCase() === selectedCategory;

        const searchMatch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch;
    });

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <>
            <section id="catalogo" className="section-catalogo">
                <Container>
                    <h2 className="section-title">Nuestros Productos</h2>

                    <Row className="mb-4" style={{ alignItems: 'center' }}>
                        <Col md={5} lg={4} className="mb-3 mb-md-0">
                            <Form.Group controlId="searchBar" className="form-group" style={{ marginBottom: 0 }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={7} lg={8}>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="filter-dropdown" className="btn">
                                    Filtros
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Header>Categoría</Dropdown.Header>
                                    {categories.map(category => (
                                        <Dropdown.Item
                                            key={category}
                                            active={selectedCategory === category}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {capitalize(category)}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>


                    <div className="product-grid-detailed">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.codigo}
                                product={product}
                                onAddToCartClick={handleAddToCart}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#D3D3D3', marginTop: '30px', fontSize: '1.2rem' }}>
                            No se encontraron productos que coincidan con tu búsqueda.
                        </p>
                    )}

                </Container>
            </section>

            <AddToCartModal
                show={showModal}
                onHide={handleCloseModal}
                product={selectedProduct}
            />
        </>
    );
};

export default CatalogoPage;