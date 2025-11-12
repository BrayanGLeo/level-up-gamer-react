import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './utils/ScrollToTop';
import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/store/HomePage';
import CatalogoPage from './pages/store/CatalogoPage';
import ProductDetailPage from './pages/store/ProductDetailPage';
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
import AdminOrdenes from './pages/admin/AdminOrdenes';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminReportes from './pages/admin/AdminReportes';
import AdminPerfil from './pages/admin/AdminPerfil';

const AdminOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  
  if (currentUser && currentUser.role === 'Administrador') {
    return children;
  }
  
  return <Navigate to="/admin/ordenes" replace />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        
        <Routes>
          <Route path="/" element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo" element={<CatalogoPage />} />
            <Route path="producto/:codigo" element={<ProductDetailPage />} />
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
            <Route path="ordenes" element={<AdminOrdenes />} />
            <Route path="productos" element={<AdminProductList />} />
            <Route path="productos/nuevo" element={<AdminProductForm />} />
            <Route path="productos/editar/:codigo" element={<AdminProductForm />} />
            
            <Route index element={<AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute>} />
            <Route path="usuarios" element={<AdminOnlyRoute><AdminUserList /></AdminOnlyRoute>} />
            <Route path="usuarios/nuevo" element={<AdminOnlyRoute><AdminUserForm /></AdminOnlyRoute>} />
            <Route path="usuarios/editar/:rut" element={<AdminOnlyRoute><AdminUserForm /></AdminOnlyRoute>} />
            <Route path="categorias" element={<AdminOnlyRoute><AdminCategorias /></AdminOnlyRoute>} />
            <Route path="reportes" element={<AdminOnlyRoute><AdminReportes /></AdminOnlyRoute>} />
            <Route path="perfil" element={<AdminOnlyRoute><AdminPerfil /></AdminOnlyRoute>} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;