import React, { Suspense, lazy } from 'react';
// --- ADDED: Import Navigate for handling redirects ---
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext'; // <-- 1. IMPORT WISHLIST PROVIDER
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import AdminRoute from '@/components/AdminRoute';

// --- Public Pages ---
const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Contact = lazy(() => import('@/pages/Contact'));
const Sustainability = lazy(() => import('@/pages/Sustainability'));
const About = lazy(() => import('@/pages/About'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const RecyclingPage = lazy(() => import('@/pages/DonationRecycling')); 
const Wishlist = lazy(() => import('@/pages/Wishlist')); // <-- 2. IMPORT WISHLIST PAGE

// --- Sustainability Sub-Pages ---
const ImpactReport = lazy(() => import('@/pages/sustainability/ImpactReport'));
const EcoFriendlyMaterials = lazy(() => import('@/pages/sustainability/EcoFriendlyMaterials'));
const CircularEconomySummary = lazy(() => import('@/pages/sustainability/CircularEconomy'));
const WaterConservation = lazy(() => import('@/pages/sustainability/WaterConservation'));
const HundredPercentEcoFriendly = lazy(() => import('@/pages/sustainability/HundredPercentEcoFriendly'));
const CircularEconomyDetail = lazy(() => import('@/pages/sustainability/CircularEconomyDetail'));
const PlanetPositive = lazy(() => import('@/pages/sustainability/PlanetPositive'));

// --- Protected User Pages ---
const Profile = lazy(() => import('@/pages/Profile'));
const MyOrders = lazy(() => import('@/pages/MyOrders'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));

// --- Protected Admin Pages ---
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUserList = lazy(() => import('@/pages/admin/AdminUserList'));
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminProductList = lazy(() => import('@/pages/admin/AdminProductList'));
const AdminProductEdit = lazy(() => import('@/pages/admin/AdminProductEdit'));
const AdminDonationList = lazy(() => import('@/pages/admin/AdminDonationList'));
const AdminOrderList = lazy(() => import('@/pages/admin/AdminOrderList'));


const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider> {/* <-- 3. WRAP WITH WISHLIST PROVIDER */}
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/sustainability" element={<Sustainability />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/recycling" element={<RecyclingPage />} />
                    <Route path="/wishlist" element={<Wishlist />} /> {/* <-- 4. ADD NEW ROUTE */}

                    {/* --- USER ORDER ROUTES --- */}
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/my-orders/:orderId" element={<OrderDetail />} />
                    
                    {/* --- Sustainability Sub-Routes --- */}
                    <Route path="/sustainability/impact-report" element={<ImpactReport />} />
                    <Route path="/sustainability/eco-friendly-materials" element={<EcoFriendlyMaterials />} />
                    <Route path="/sustainability/circular-economy-summary" element={<CircularEconomySummary />} /> 
                    <Route path="/sustainability/water-conservation" element={<WaterConservation />} />
                    <Route path="/sustainability/100-eco-friendly" element={<HundredPercentEcoFriendly />} />
                    <Route path="/sustainability/circular-economy" element={<CircularEconomyDetail />} />
                    <Route path="/sustainability/planet-positive" element={<PlanetPositive />} />
                    
                    {/* --- Admin Routes (Protected) --- */}
                    <Route path="/admin" element={<AdminRoute />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />}>
                        <Route index element={<AdminOverview />} />
                        <Route path="users" element={<AdminUserList />} />
                        <Route path="products" element={<AdminProductList />} />
                        <Route path="products/:id/edit" element={<AdminProductEdit />} />
                        <Route path="donations" element={<AdminDonationList />} />
                        <Route path="orders" element={<AdminOrderList />} />
                      </Route>
                      <Route path="users" element={<Navigate to="/admin/dashboard/users" replace />} />
                      <Route path="products" element={<Navigate to="/admin/dashboard/products" replace />} />
                      <Route path="donations" element={<Navigate to="/admin/dashboard/donations" replace />} />
                      <Route path="orders" element={<Navigate to="/admin/dashboard/orders" replace />} />
                    </Route>

                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </WishlistProvider> {/* <-- 3. CLOSE PROVIDER */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;