import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'

// Public
import LandingPage from './pages/public/LandingPage'

// Auth
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Student
import DashboardPage from './pages/student/DashboardPage'
import BrowsePage from './pages/student/BrowsePage'
import ItemDetailsPage from './pages/student/ItemDetailsPage'
import ReportLostPage from './pages/student/ReportLostPage'
import ReportFoundPage from './pages/student/ReportFoundPage'
import ClaimVerificationPage from './pages/student/ClaimVerificationPage'
import ContactRevealPage from './pages/student/ContactRevealPage'
import ReturnConfirmationPage from './pages/student/ReturnConfirmationPage'
import MyClaimsPage from './pages/student/MyClaimsPage'

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage'
import AdminReportsDisputesPage from './pages/admin/AdminReportsDisputesPage'
import AdminOwnershipClaimsPage from './pages/admin/AdminOwnershipClaimsPage'
import AdminFlagsPage from './pages/admin/AdminFlagsPage'
import AdminActivityLogPage from './pages/admin/AdminActivityLogPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Student — protected */}
          <Route
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/items/:type/:id" element={<ItemDetailsPage />} />
            <Route path="/report-lost" element={<ReportLostPage />} />
            <Route path="/report-found" element={<ReportFoundPage />} />
            <Route path="/my-claims" element={<MyClaimsPage />} />
            <Route path="/claims/:id/verify" element={<ClaimVerificationPage />} />
            <Route path="/claims/:id/contact" element={<ContactRevealPage />} />
            <Route path="/claims/:id/confirm" element={<ReturnConfirmationPage />} />
            <Route path="/claims/:id/status" element={<MyClaimsPage />} />
          </Route>

          {/* Admin — admin-only protected */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            <Route path="/admin/reports" element={<AdminReportsDisputesPage />} />
            <Route path="/admin/claims" element={<AdminOwnershipClaimsPage />} />
            <Route path="/admin/flags" element={<AdminFlagsPage />} />
            <Route path="/admin/activity" element={<AdminActivityLogPage />} />
            <Route path="/admin/settings" element={<AdminDashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
