import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../data/productData';
import NotificationModal from '../components/NotificationModal';

export interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => boolean;
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
    const [showModal, setShowModal] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalTitle, setModalTitle] = useState("Aviso");
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (title: string, msg: string) => {
        setModalTitle(title);
        setModalMsg(msg);
        setShowModal(true);
    };

    const addToCart = (product: Product): boolean => {
        const existingItem = cartItems.find(item => item.codigo === product.codigo);
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (currentQuantity + 1 > product.stock) {
            handleShowModal("Stock Insuficiente", `¡Lo sentimos! No hay stock de ${product.nombre} disponibles.`);
            return false;
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
        return true;
    };

    const updateQuantity = (codigo: string, amount: number) => {
        const item = cartItems.find(i => i.codigo === codigo);
        if (!item) return;

        if (amount > 0 && item.quantity + amount > item.stock) {
            handleShowModal("Límite Alcanzado", `No puedes añadir más. El stock máximo disponible es ${item.stock}.`);
            return;
        }

        const newCart = cartItems.map(item =>
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

            <NotificationModal
                show={showModal}
                onHide={handleCloseModal}
                title={modalTitle}
                message={modalMsg}
            />
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);