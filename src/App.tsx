import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterMechanic from './pages/RegisterMechanic';
import CustomerDashboard from './pages/customer/Dashboard';
import NewRequest from './pages/customer/NewRequest';
import NearbyMechanics from './pages/customer/NearbyMechanics';
import MyRequests from './pages/customer/MyRequests';
import MechanicDashboard from './pages/mechanic/Dashboard';
import PendingRequests from './pages/mechanic/PendingRequests';
import MyJobs from './pages/mechanic/MyJobs';
import Tracking from "./pages/customer/Tracking";
import MechanicTracking from "./pages/mechanic/Tracking";


function RootRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Home />;
  }

  return <Navigate to={role === 'MECHANIC' ? '/mechanic' : '/customer'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
  <Routes>

    <Route path="/" element={<RootRedirect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register/customer" element={<RegisterCustomer />} />
    <Route path="/register/mechanic" element={<RegisterMechanic />} />

    <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/customer/new-request" element={<NewRequest />} />
      <Route path="/customer/nearby" element={<NearbyMechanics />} />
      <Route path="/customer/requests" element={<MyRequests />} />
      <Route
        path="/customer/tracking/:id"
        element={<Tracking />}
      />
    </Route>

    <Route element={<ProtectedRoute allowedRole="MECHANIC" />}>
  <Route path="/mechanic" element={<MechanicDashboard />} />
  <Route path="/mechanic/pending" element={<PendingRequests />} />
  <Route path="/mechanic/jobs" element={<MyJobs />} />
  <Route
    path="/mechanic/tracking/:id"
    element={<MechanicTracking />}
  />
</Route>

    <Route path="*" element={<Navigate to="/" replace />} />

  </Routes>
</BrowserRouter>
    </AuthProvider>
  );
}
