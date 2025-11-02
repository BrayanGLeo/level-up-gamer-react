import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Catalogo.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { nombre, descripcion, precio, imagen } = product;

    return (
        <div className="product-card">
            <img src={imagen} alt={nombre} className="product-image" />
            <div className="product-info">
                <h3 className="product-title">{nombre}</h3>
                <p className="product-description">{descripcion}</p>
                <p className="product-price">${precio.toLocaleString('es-CL')} CLP</p>
                <button onClick={() => addToCart(product)} className="btn btn-small">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;