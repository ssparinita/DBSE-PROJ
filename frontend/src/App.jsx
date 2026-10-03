import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import About from "./pages/About";

import StudioLayout from "./pages/studio/StudioLayout";
import StudioOverview from "./pages/studio/Overview";
import StudioProducts from "./pages/studio/Products";
import StudioInventory from "./pages/studio/Inventory";
import StudioOrders from "./pages/studio/Orders";
import StudioRevenue from "./pages/studio/Revenue";
import StudioTrust from "./pages/studio/Trust";
import StudioDemand from "./pages/studio/Demand";
import StudioReviews from "./pages/studio/Reviews";
import StudioInsights from "./pages/studio/Insights";
import StudioIntelligence from "./pages/studio/Intelligence";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/Overview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/Users";
import AdminVendors from "./pages/admin/Vendors";
import AdminIntelligence from "./pages/admin/Intelligence";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* CUSTOMER / PUBLIC */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Marketplace />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* VENDOR */}
        <Route path="/studio" element={<StudioLayout />}>
          <Route index element={<StudioOverview />} />
          <Route path="products" element={<StudioProducts />} />
          <Route path="inventory" element={<StudioInventory />} />
          <Route path="orders" element={<StudioOrders />} />
          <Route path="revenue" element={<StudioRevenue />} />
          <Route path="trust" element={<StudioTrust />} />
          <Route path="demand" element={<StudioDemand />} />
          <Route path="reviews" element={<StudioReviews />} />
          <Route path="insights" element={<StudioInsights />} />
          <Route path="intelligence" element={<StudioIntelligence />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="intelligence" element={<AdminIntelligence />} />
        </Route>

        <Route path="*" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;