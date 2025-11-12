import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Importar Link
import '../styles/Catalogo.css';
import { Product } from '../data/productData';

interface ProductCardProps {
    product: Product;
    onAddToCartClick: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCartClick }: ProductCardProps) => {
    const { codigo, nombre, descripcion, precio, imagen } = product;

    return (
        <div className="product-card">
            <img src={imagen} alt={nombre} className="product-image" />
            <div className="product-info">
                <h3 className="product-title">{nombre}</h3>
                <p className="product-description">{descripcion}</p>
                <p className="product-price">${precio.toLocaleString('es-CL')} CLP</p>               
                <div className="product-card-buttons">
                    <button onClick={() => onAddToCartClick(product)} className="btn btn-small">
                        Agregar
                    </button>
                    <Link to={`/producto/${codigo}`} className="btn btn-small btn-details">
                        Detalles
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ProductCard;