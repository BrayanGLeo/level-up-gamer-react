import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('carrito');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const updateLocalStorage = (items) => {
        localStorage.setItem('carrito', JSON.stringify(items));
    };

    const addToCart = (product) => {
        let newCart = [...cartItems];
        const existingItem = newCart.find(item => item.codigo === product.codigo);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            newCart.push({ ...product, quantity: 1 });
        }

        setCartItems(newCart);
        updateLocalStorage(newCart);
        alert(`"${product.nombre}" ha sido añadido al carrito.`);
    };

    const updateQuantity = (codigo, amount) => {
        let newCart = cartItems.map(item =>
            item.codigo === codigo ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
        );

        newCart = newCart.filter(item => item.quantity > 0);

        setCartItems(newCart);
        updateLocalStorage(newCart);
    };

    const clearCart = () => {
        setCartItems([]);
        updateLocalStorage([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, clearCart, getCartTotal, getCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);