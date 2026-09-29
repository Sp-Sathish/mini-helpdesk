import { Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminTicketsPage from './pages/AdminTicketsPage'
import CreateTicketPage from './pages/CreateTicketPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TicketDetailPage from './pages/TicketDetailPage'
import TicketListPage from './pages/TicketListPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <AdminRoute>
              <AdminTicketsPage />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="*" element={<Navigate to="/tickets" replace />} />
      </Routes>
    </>
  )
}

export default App
