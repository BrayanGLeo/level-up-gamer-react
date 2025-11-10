import React from 'react';
import '../styles/Catalogo.css';
import { Product } from '../data/productData';

interface ProductCardProps {
    product: Product;
    onAddToCartClick: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCartClick }: ProductCardProps) => {
    const { nombre, descripcion, precio, imagen } = product;

    return (
        <div className="product-card">
            <img src={imagen} alt={nombre} className="product-image" />
            <div className="product-info">
                <h3 className="product-title">{nombre}</h3>
                <p className="product-description">{descripcion}</p>
                <p className="product-price">${precio.toLocaleString('es-CL')} CLP</p>
                <button onClick={() => onAddToCartClick(product)} className="btn btn-small">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;