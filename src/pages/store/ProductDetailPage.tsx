import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getProductByCode, Product } from '../../data/productData';
import { useCart } from '../../context/CartContext';
import AddToCartModal from '../../components/AddToCartModal';
import '../../styles/ProductDetail.css'; // Crearemos este archivo a continuación

const ProductDetailPage = () => {
    // 1. Obtener el 'codigo' del producto desde la URL
    const { codigo } = useParams<{ codigo: string }>();
    
    // 2. Buscar el producto usando el código
    const product: Product | undefined = codigo ? getProductByCode(codigo) : undefined;

    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            setShowModal(true);
        }
    };

    // 3. Manejar el caso de que el producto no exista
    if (!product) {
        return (
            <main className="product-detail-main">
                <Container>
                    <Alert variant="danger" className="text-center">
                        <Alert.Heading>Producto no encontrado</Alert.Heading>
                        <p>
                            El producto que buscas no existe o el código es incorrecto.
                        </p>
                        <hr />
                        <Link to="/catalogo" className="btn">
                            Volver al Catálogo
                        </Link>
                    </Alert>
                </Container>
            </main>
        );
    }

    // 4. Renderizar la página de detalles
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
                            
                            <p className="product-detail-description">
                                {product.descripcion}
                            </p>
                            
                            <div className="product-detail-meta">
                                <p><strong>Categoría:</strong> {product.categoria}</p>
                                <p><strong>Código:</strong> {product.codigo}</p>
                                <p><strong>Stock disponible:</strong> {product.stock} unidades</p>
                            </div>

                            <div className="product-detail-price">
                                {product.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                            </div>

                            <Button 
                                onClick={handleAddToCart} 
                                className="btn btn-lg w-100"
                                disabled={product.stock === 0}
                            >
                                {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                            </Button>
                        </Col>
                    </Row>

                    <div className="text-center mt-5">
                        <Link to="/catalogo" className="btn">
                            &larr; Volver al Catálogo
                        </Link>
                    </div>
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