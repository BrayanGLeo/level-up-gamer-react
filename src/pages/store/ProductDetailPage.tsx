import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Alert, Tabs, Tab, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getProductByCode, Product, Specifications } from '../../data/productData';
import { useCart } from '../../context/CartContext';
import AddToCartModal from '../../components/AddToCartModal';
import '../../styles/ProductDetail.css';

const renderSpecifications = (specs: Specifications) => {
    return (
        <Table striped bordered hover variant="dark" responsive="sm" className="specs-table">
            <tbody>
                {Object.entries(specs).map(([groupTitle, groupSpecs]) => (
                    <React.Fragment key={groupTitle}>
                        <tr className="specs-group-title">
                            <td colSpan={2}>{groupTitle}</td>
                        </tr>
                        {Object.entries(groupSpecs).map(([specName, specValue]) => (
                            <tr key={specName}>
                                <td>{specName}</td>
                                <td>{specValue}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </Table>
    );
};


const ProductDetailPage = () => {
    const { codigo } = useParams<{ codigo: string }>();
    const product: Product | undefined = codigo ? getProductByCode(codigo) : undefined;

    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            setShowModal(true);
        }
    };

    if (!product) {
        return (
            <main className="product-detail-main">
                <Container>
                    <Alert variant="danger" className="text-center">
                        <Alert.Heading>Producto no encontrado</Alert.Heading>
                        <p>El producto que buscas no existe o el código es incorrecto.</p>
                        <hr />
                        <Link to="/catalogo" className="btn">
                            Volver al Catálogo
                        </Link>
                    </Alert>
                </Container>
            </main>
        );
    }

    return (
        <>
            <main className="product-detail-main">
                <Container>
                    <Row>
                        <Col md={6} className="product-detail-image-col">
                            <Image src={product.imagen} alt={product.nombre} fluid className="product-detail-image" />
                        </Col>
                        
                        <Col md={6} className="product-detail-info-col">
                            <h2 className="product-detail-title">{product.nombre}</h2>
                            
                            <div className="product-detail-price">
                                {product.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                            </div>

                            <p className="product-detail-stock">
                                {product.stock > 0 
                                    ? `Stock disponible: ${product.stock} unidades` 
                                    : 'Agotado'}
                            </p>

                            <Button 
                                onClick={handleAddToCart} 
                                className="btn btn-lg w-100"
                                disabled={product.stock === 0}
                            >
                                {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                            </Button>

                            <div className="text-center mt-4">
                                <Link to="/catalogo" className="btn-link">
                                    &larr; Volver al Catálogo
                                </Link>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Tabs defaultActiveKey="descripcion" id="product-info-tabs" className="product-tabs mb-3">
                                
                                <Tab eventKey="descripcion" title="Descripción">
                                    <div className="product-tab-content">
                                        <h4>Descripción General</h4>
                                        <p className="product-detail-description">
                                            {product.descripcion}
                                        </p>
                                        
                                        {product.features && product.features.length > 0 && (
                                            <>
                                                <h5 className="mt-4">Características Principales:</h5>
                                                <ul className="product-features-list">
                                                    {product.features.map((feature, index) => (
                                                        <li key={index}>{feature}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </Tab>
                                
                                <Tab 
                                    eventKey="especificaciones" 
                                    title="Especificaciones"
                                >
                                    <div className="product-tab-content">
                                        <h4>Especificaciones Técnicas</h4>
                                        
                                        {product.specifications && Object.keys(product.specifications).length > 0 ? 
                                            renderSpecifications(product.specifications) :
                                            <p>No hay especificaciones técnicas detalladas para este producto.</p>
                                        }
                                    </div>
                                </Tab>

                            </Tabs>
                        </Col>
                    </Row>

                </Container>
            </main>

            <AddToCartModal
                show={showModal}
                onHide={() => setShowModal(false)}
                product={product}
            />
        </>
    );
};

export default ProductDetailPage;