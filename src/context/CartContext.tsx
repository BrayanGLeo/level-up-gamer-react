import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../data/productData';

export interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
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

    const addToCart = (product: Product) => {
        const existingItem = cartItems.find(item => item.codigo === product.codigo);

        const currentQuantity = existingItem ? existingItem.quantity : 0;
        if (currentQuantity + 1 > product.stock) {
            alert(`¡Stock insuficiente! Solo quedan ${product.stock} unidades de ${product.nombre}.`);
            return;
        }

        let newCart: CartItem[];

        if (existingItem) {
            newCart = cartItems.map(item =>
                item.codigo === product.codigo
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...cartItems, { ...product, quantity: 1 }];
        }

        setCartItems(newCart);
    };

    const updateQuantity = (codigo: string, amount: number) => {
        const item = cartItems.find(i => i.codigo === codigo);
        if (!item) return;

        if (amount > 0 && item.quantity + amount > item.stock) {
            alert(`No puedes añadir más. Stock máximo: ${item.stock}`);
            return;
        }

        let newCart = cartItems.map(item =>
            item.codigo === codigo ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
        );

        setCartItems(newCart);
    };

    const removeFromCart = (codigo: string) => {
        const newCart = cartItems.filter(item => item.codigo !== codigo);
        setCartItems(newCart);
    };

    const clearCart = () => {
        setCartItems([]);
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