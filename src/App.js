import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/store/HomePage';
import CatalogoPage from './pages/store/CatalogoPage';
import BlogPage from './pages/store/BlogPage';
import BlogDetailPage from './pages/store/BlogDetailPage';
import ContactoPage from './pages/store/ContactoPage';
import LoginPage from './pages/store/LoginPage';
import RegisterPage from './pages/store/RegisterPage';
import CartPage from './pages/store/CartPage';
import CheckoutPage from './pages/store/CheckoutPage';
import OrderSuccessPage from './pages/store/OrderSuccessPage';
import OrderErrorPage from './pages/store/OrderErrorPage';
import PerfilPage from './pages/store/PerfilPage';
import PrivacidadPage from './pages/store/PrivacidadPage';
import PedidosPage from './pages/store/PedidosPage';
import DireccionesPage from './pages/store/DireccionesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserForm from './pages/admin/AdminUserForm';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo" element={<CatalogoPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<BlogDetailPage />} />
            <Route path="contacto" element={<ContactoPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="carrito" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="compra-exitosa" element={<OrderSuccessPage />} />
            <Route path="compra-fallida" element={<OrderErrorPage />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="privacidad" element={<PrivacidadPage />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="direcciones" element={<DireccionesPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductList />} />
            <Route path="productos/nuevo" element={<AdminProductForm />} />
            <Route path="productos/editar/:codigo" element={<AdminProductForm />} />
            <Route path="usuarios" element={<AdminUserList />} />
            <Route path="usuarios/nuevo" element={<AdminUserForm />} />
            <Route path="usuarios/editar/:rut" element={<AdminUserForm />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;