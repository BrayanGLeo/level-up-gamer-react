import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../data/productData';
import '../../styles/Catalogo.css';
import { useCart } from '../../context/CartContext';
import AddToCartModal from '../../components/AddToCartModal';

const CatalogoPage = () => {
    const products = getProducts();
    const { addToCart } = useCart();

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleCloseModal = () => setShowModal(false);

    const handleAddToCart = (product) => {
        addToCart(product);
        setSelectedProduct(product);
        setShowModal(true);
    };

    return (
        <>
            <section id="catalogo" className="section-catalogo">
                <Container>
                    <h2 className="section-title">Nuestros Productos</h2>
                    <div className="product-grid-detailed">
                        {products.map(product => (
                            <ProductCard
                                key={product.codigo}
                                product={product}
                                onAddToCartClick={handleAddToCart}
                            />
                        ))}
                    </div>
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