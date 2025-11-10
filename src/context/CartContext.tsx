import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product } from '../data/productData';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    updateQuantity: (codigo: string, amount: number) => void;
    removeFromCart: (codigo: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemCount: () => number;
}

interface CartProviderProps {
    children: ReactNode;
}

const CartContext = createContext<CartContextType>(null!);

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('carrito');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart) as CartItem[]);
        }
    }, []);

    const updateLocalStorage = (items: CartItem[]) => {
        localStorage.setItem('carrito', JSON.stringify(items));
    };

    const addToCart = (product: Product) => {
        let newCart = [...cartItems];
        const existingItem = newCart.find(item => item.codigo === product.codigo);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            newCart.push({ ...product, quantity: 1 });
        }

        setCartItems(newCart);
        updateLocalStorage(newCart);
    };

    const updateQuantity = (codigo: string, amount: number) => {
        let newCart = cartItems.map(item =>
            item.codigo === codigo ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
        );

        newCart = newCart.filter(item => item.quantity > 0);

        setCartItems(newCart);
        updateLocalStorage(newCart);
    };

    const removeFromCart = (codigo: string) => {
        const newCart = cartItems.filter(item => item.codigo !== codigo);
        setCartItems(newCart);
        updateLocalStorage(newCart);
    };

    const clearCart = () => {
        setCartItems([]);
        updateLocalStorage([]);
    };

    const getCartTotal = (): number => {
        return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    const getCartItemCount = (): number => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);