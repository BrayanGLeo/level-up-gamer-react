import React from 'react';
import { Container } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../data/productData';
import '../../styles/Catalogo.css';

const CatalogoPage = () => {
    const products = getProducts();

    return (
        <section id="catalogo" className="section-catalogo">
            <Container>
                <h2 className="section-title">Nuestros Productos</h2>
                <div className="product-grid-detailed">
                    {products.map(product => (
                        <ProductCard key={product.codigo} product={product} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default CatalogoPage;