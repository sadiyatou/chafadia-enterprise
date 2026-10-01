import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import StockControl from "./pages/admin/StockControl";
import PromotionsDiscounts from "./pages/admin/PromotionsDiscounts";
import Announcements from "./pages/admin/Announcements";
import CustomerReviews from "./pages/admin/CustomerReviews";
import CustomerMessages from "./pages/admin/CustomerMessages";
import SalesReports from "./pages/admin/SalesReports";
import WebsiteSettings from "./pages/admin/WebsiteSettings";
import Transactions from "./pages/admin/Transactions";
import Receipts from "./pages/admin/Receipts";

import CashierDashboard from "./pages/cashier/CashierDashboard";

import CustomerDashboard from "./pages/customer/CustomerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />

            <Route
             path="/admin/stock"
             element={
               <ProtectedRoute allowedRoles={["admin"]}>
                  <StockControl />
                   </ProtectedRoute>
             }
          />

            <Route
            path="/admin/orders"
            element={
               <ProtectedRoute allowedRoles={["admin"]}>
                <ManageOrders />
              </ProtectedRoute>
              }
          />

     <Route
  path="/admin/promotions"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PromotionsDiscounts />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/announcements"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Announcements />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/customers"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CustomerReviews />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/messages"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CustomerMessages />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <SalesReports />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/settings"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <WebsiteSettings />
    </ProtectedRoute>
  }
/>

            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Transactions />
                </ProtectedRoute>
              }
            />

            

            <Route
              path="/admin/receipts"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Receipts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cashier"
              element={
                <ProtectedRoute allowedRoles={["cashier", "admin"]}>
                  <CashierDashboard />
                </ProtectedRoute>
              }
            />


            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;