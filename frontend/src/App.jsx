import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDonors from './pages/admin/AdminDonors';
import AdminRecipients from './pages/admin/AdminRecipients';
import BloodStorage from './pages/admin/BloodStorage';
import BloodStorageHistory from './pages/admin/BloodStorageHistory';
import AdminBloodRequests from './pages/admin/AdminBloodRequests';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminProfile from './pages/admin/AdminProfile';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorBloodRequest from './pages/donor/DonorBloodRequest';
import DonorDonationHistory from './pages/donor/DonorDonationHistory';
import DonorAppointment from './pages/donor/DonorAppointment';
import DonorProfile from './pages/donor/DonorProfile';

// Recipient Pages
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import RecipientBloodRequest from './pages/recipient/RecipientBloodRequest';
import RecipientProfile from './pages/recipient/RecipientProfile';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDonors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recipients"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRecipients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blood-storage"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BloodStorage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BloodStorageHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminBloodRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* Donor Protected Routes */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/blood-request"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorBloodRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/history"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDonationHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/appointment"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/profile"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorProfile />
          </ProtectedRoute>
        }
      />

      {/* Recipient Protected Routes */}
      <Route
        path="/recipient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['recipient']}>
            <RecipientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipient/blood-request"
        element={
          <ProtectedRoute allowedRoles={['recipient']}>
            <RecipientBloodRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipient/profile"
        element={
          <ProtectedRoute allowedRoles={['recipient']}>
            <RecipientProfile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
