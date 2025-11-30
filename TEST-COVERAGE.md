# Resumen de Cobertura de Tests

Este documento describe, por archivo de prueba, qué partes del código cubren las pruebas existentes en `test/`, qué aserciones principales hacen, qué envoltorios (`Router` / `Providers`) requieren y huecos recomendados.

**Cómo ejecutar las pruebas**

- Ejecutar las pruebas: `npm test`
- Ejecutar con reporte de cobertura: `npm test -- --coverage`

**Resumen por archivo de prueba**

- `test/context/CartContext.test.tsx`:
  - **Cubre**: `src/context/CartContext.tsx` (estado y métodos del carrito).
  - **Aserciones**: agregar/remover items, actualizar cantidad, clear, total y conteo de items; persistencia en `localStorage['carrito']`.
  - **Envoltorios**: `CartProvider`.
  - **Huecos**: no prueba límites de `stock`, inputs inválidos ni `localStorage` corrupto.

- `test/context/AuthContext.test.tsx`:
  - **Cubre**: `src/context/AuthContext.tsx` (login, logout, register, carga desde `localStorage`).
  - **Aserciones**: estado inicial, login exitoso/fallido, logout, persistencia en `localStorage`.
  - **Mocks**: `src/data/userData` para controlar `findUser` y `registerUser`.
  - **Huecos**: cambios de contraseña y permisos más finos.

- `test/components/ProductCard.test.tsx`:
  - **Cubre**: `src/components/ProductCard.tsx`.
  - **Aserciones**: renderiza nombre/descripcion/precio/imagen; callback `onAddToCartClick`; link a `/producto/:codigo`.
  - **Envoltorios**: `BrowserRouter`.
  - **Huecos**: variantes cuando hay poco stock o sin stock.

- `test/components/NotificationModal.test.tsx`:
  - **Cubre**: `src/components/NotificationModal.tsx`.
  - **Aserciones**: títulos y mensajes; `onHide` al aceptar.
  - **Huecos**: accesibilidad y variantes de tipo de mensaje.

- `test/components/layout/Header.test.tsx`:
  - **Cubre**: `src/components/layout/Header.tsx`.
  - **Aserciones**: render para invitado vs usuario logueado; badge del carrito; menú admin cuando corresponde.
  - **Mocks**: `useAuth`, `useCart` (mockeados para controlar estados).
  - **Huecos**: interacciones del dropdown y rutas protegidas.

- `test/utils/validation.test.ts`:
  - **Cubre**: `src/utils/validation.tsx`.
  - **Aserciones**: validadores de email, RUT, teléfono y fecha de nacimiento (mayor de 18).
  - **Huecos**: más pruebas fuzz / casos límite y formatos internacionales.

- `test/data/userData.test.ts`:
  - **Cubre**: `src/data/userData.ts` (CRUD de usuarios, direcciones y pedidos).
  - **Aserciones**: registro, duplicados, actualización, historial de emails, manejo de direcciones, adición y actualización de pedidos.
  - **Huecos**: concurrencia y migraciones de estructura en `localStorage`.

- `test/data/categoryData.test.ts`:
  - **Cubre**: `src/data/categoryData.ts`.
  - **Aserciones**: obtener categorías iniciales y desde `localStorage`, crear/editar/eliminar categorías.
  - **Huecos**: validación de nombres duplicados o entradas inválidas.

- `test/pages/store/CatalogoPage.test.tsx`:
  - **Cubre**: `src/pages/store/CatalogoPage.tsx`.
  - **Aserciones**: render de productos (mock de `productData.getProducts`), búsqueda por nombre, filtrado por categoría, mensaje sin resultados.
  - **Envoltorios**: `CartProvider`, `BrowserRouter`.
  - **Huecos**: paginación y flujo completo de "Agregar al carrito" integrado.

- `test/pages/store/CartPage.test.tsx`:
  - **Cubre**: `src/pages/store/CartPage.tsx`.
  - **Aserciones**: vista vacía vs con items, total formateado, comportamiento de "Finalizar Compra" para invitado (muestra modal) y usuario logueado (navega a `/checkout`).
  - **Mocks**: `useAuth`, `useCart`, `useNavigate`.
  - **Huecos**: edición de cantidades con efectos reales en `CartContext`.

- `test/pages/store/LoginPage.test.tsx`:
  - **Cubre**: `src/pages/store/LoginPage.tsx`.
  - **Aserciones**: render del formulario y entrada de datos; envío básico (sin aserciones explícitas sobre mensajes de error en todos los casos).
  - **Envoltorios**: `AuthProvider`, `BrowserRouter`.
  - **Huecos**: verificar mensajes de error y navegación tras login.

- `test/pages/store/RegisterPage.test.tsx`:
  - **Cubre**: `src/pages/store/RegisterPage.tsx`.
  - **Aserciones**: validaciones (mock de utilitarios), flujo de registro exitoso y fallo por email duplicado, modal de confirmación.
  - **Mocks**: `useAuth.register`, utilidades de validación.
  - **Huecos**: integración con `userData.registerUser` real.

- `test/pages/store/PerfilPage.test.tsx`:
  - **Cubre**: `src/pages/store/PerfilPage.tsx`.
  - **Aserciones**: muestra nombre, email y fecha registrada (o texto alternativo si falta).
  - **Mocks**: `useAuth`.
  - **Huecos**: edición de perfil y gestión de direcciones desde UI.

- `test/pages/store/OrderSuccessPage.test.tsx`:
  - **Cubre**: `src/pages/store/OrderSuccessPage.tsx`.
  - **Aserciones**: muestra número de pedido pasado por `location.state`; botón `Descargar Boleta` (librerías `jspdf` mockeadas).
  - **Huecos**: contenido real del PDF y casos sin `location.state`.

- `test/pages/store/ContactoPage.test.tsx` y `test/pages/store/BlogPage.test.tsx`:
  - **Cubre**: páginas informativas `ContactoPage` y `BlogPage` (mock de `blogData.getBlogPosts`).
  - **Aserciones**: render de contenidos estáticos y lista de posts.
  - **Huecos**: navegación al detalle de posts y formularios de contacto.

**Recomendaciones prioritarias**

- Añadir tests para la carpeta `src/pages/admin/` (actualmente `test/pages/admin/` está vacío). Probar: `AdminProductList`, `AdminDashboard`, roles y permisos.
- Probar `ProductDetailPage` y modales (`AddToCartModal`, `OrderDetailModal`) con `MemoryRouter` y providers para validar interacciones completas.
- Añadir pruebas de integración para el flujo de `Checkout` y casos de pago.
- Ejecutar `npm test -- --coverage` para obtener métricas por archivo y añadir un resumen (líneas/branches) a este documento.

---

Fecha: 30 de noviembre de 2025

Si quieres, ejecuto ahora `npm test -- --coverage` y pego el resumen de cobertura en este archivo. También puedo abrir un PR con `TEST-COVERAGE.md` y un cambio propuesto para tests nuevos.  

---

## Resumen numérico de cobertura (ejecución `vitest --coverage`)

Resultados clave:

- **Archivos de prueba ejecutados**: 16
- **Tests**: 72 pasados
- **Cobertura global**: Statements 64.63%, Branches 46.36%, Functions 66.89%, Lines 65.42%

Archivos con cobertura baja o áreas críticas para mejorar (ejemplos):

- `src/pages/store/OrderSuccessPage.tsx`: Lines 12.5% — gran parte del flujo (PDF y casos alternativos) no está cubierto.
- `src/data/productData.ts`: Statements 21.87% — muchas funciones no cubiertas (guardado, búsqueda por código avanzada, manejo de localStorage con edge cases).
- `src/pages/store/PerfilPage.tsx` y `src/pages/store/CartPage.tsx`: cobertura parcial en lógica de UI/condicionales y manejo de cantidades.
- `src/utils/validation.tsx`: cobertura parcial (algunos validadores y ramas no cubiertos).

Sugerencias prácticas para aumentar cobertura al 80%+ en áreas críticas:

- Añadir tests que simulen `ProductDetailPage` y `AddToCartModal` para cubrir el flujo de agregar al carrito y límites de stock.
- Tests para `OrderSuccessPage` que verifiquen comportamiento con/ sin `location.state`, y que invoquen la generación de PDF (mockear y afirmar llamadas).  
- Ampliar `userData` y `productData` tests para cubrir ramas no cubiertas (errores y validaciones, formatos corruptos en `localStorage`).
- Añadir tests de `admin` (crear/editar/eliminar producto y categoría) y rutas protegidas (usuario admin vs invitado).

Si quieres que añada algunos tests ahora (por ejemplo: `ProductDetailPage` + `OrderSuccessPage`), dímelo y los crearé y ejecutaré inmediatamente.