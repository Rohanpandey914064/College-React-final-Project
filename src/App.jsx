import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Deconstruct from "./pages/Deconstruct";
import Substitute from "./pages/Substitute";
import Explore from "./pages/Explore";
import Visualize from "./pages/Visualize";
import Localize from "./pages/Localize";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected app routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/deconstruct" element={<ProtectedRoute><Deconstruct /></ProtectedRoute>} />
      <Route path="/substitute" element={<ProtectedRoute><Substitute /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/visualize" element={<ProtectedRoute><Visualize /></ProtectedRoute>} />
      <Route path="/localize" element={<ProtectedRoute><Localize /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

