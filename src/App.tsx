
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Marketplace from '@/pages/Marketplace';
import Clients from '@/pages/Clients';
import Folders from '@/pages/Folders';
import Quotes from '@/pages/Quotes';
import QuoteDetailPage from '@/pages/Quotes/components/QuoteDetailPage';
import CartPage from '@/pages/Cart';
import OfferPlateDetailPage from '@/pages/OfferPlates/OfferPlateDetailPage';
import Settings from '@/pages/Settings';
import PaymentSuccess from '@/pages/Payment/PaymentSuccess';
import PaymentFailure from '@/pages/Payment/PaymentFailure';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Marketplace />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Clients />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Folders />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Quotes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotes/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <QuoteDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/offer-plates/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OfferPlateDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CartPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Payment pages accessible to anyone without authentication */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
