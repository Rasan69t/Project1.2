// import tailwindcss from "@tailwindcss/vite"
import { Routes , Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
//import Admin_Login from "./pages/Admin_Login";
import Admin from "./pages/Admin";
import Login from "./pages/Etu_Login";
import ProtectedRoute from './components/protectedRoute';
import ProtectedRouteEtudiant from "./components/ProtectedRouteEtudiant";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRouteEtudiant><Dashboard /></ProtectedRouteEtudiant>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      {/* <Route path="/Admin_Login" element={<Admin_Login />} /> */}
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}