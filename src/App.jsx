import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'
import GhostEther from './components/ui/ghost-ether'

// Public
import LandingPage from './pages/public/LandingPage'

// Auth
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import AuthCallbackPage from './pages/auth/AuthCallbackPage'

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
import ClaimStatusPage from './pages/student/ClaimStatusPage'

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage'
import AdminReportsDisputesPage from './pages/admin/AdminReportsDisputesPage'
import AdminOwnershipClaimsPage from './pages/admin/AdminOwnershipClaimsPage'
import AdminFlagsPage from './pages/admin/AdminFlagsPage'
import AdminActivityLogPage from './pages/admin/AdminActivityLogPage'

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* ── Global ambient background — mounted once, never remounts on route change ── */}
      <div className="fixed inset-0 z-0 pointer-events-none touch-none" aria-hidden="true">
        <GhostEther
          colors={["#D4F547", "#7B2CBF", "#3F37C9", "#00F5D4"]}
          mouseForce={18}
          cursorSize={70}
          isViscous={true}
          viscous={25}
          iterationsViscous={20}
          iterationsPoisson={20}
          resolution={0.4}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.35}
          autoIntensity={1.6}
          takeoverDuration={0.3}
          autoResumeDelay={2000}
          autoRampDuration={1}
          className="w-full h-full"
        />
        {/* Subtle dark veil so text always stays readable */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── All application content sits above the WebGL canvas ── */}
      <div className="relative z-10 min-h-screen flex flex-col">
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
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

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
            <Route path="/claims/:id/status" element={<ClaimStatusPage />} />
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
      </div>
    </div>
  )
}
