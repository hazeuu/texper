import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/layout";
import Layout_home from "./components/layout_home";
import Forgot_passwords from "./pages/Forgot_passwords";
import Dashboard from "./pages/internal/jsx/Dashboard";
import Calendar from "./pages/internal/jsx/calendar";
import Reminder from "./pages/internal/jsx/reminder";
import Account from "./pages/internal/jsx/account";
import ProtectedRoute from "./ProtectedRoute";
import QandA from "./pages/QandA";
import Reset_password from "./pages/internal/jsx/reset_password";
import Admin_register from "./pages/internal/jsx/admin_register";
import ReminderPage from "./pages/internal/jsx/ReminderPage";
import Navbar from "./components/navbar";
import './App.css';

function App() {
  const location= useLocation();
  const isHome= location.pathname === "/";
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout_home><Home /></Layout_home>} />
      <Route path="/About" element={<Layout_home><About /></Layout_home>} />
      <Route path="/Login" element={<Layout><Login /></Layout>} />
      <Route path="/Signup" element={<Layout><Signup /></Layout>} />
      <Route path="/Forgot_passwords" element={<Layout><Forgot_passwords /></Layout>} />
      <Route path="/reset_password" element={<Layout><Reset_password /></Layout>} />
      <Route path="/QandA" element={<Layout_home><QandA /></Layout_home>} />
      <Route path="/admin_register" element={<Layout_home><Admin_register /></Layout_home>} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/Dashboard" element={<Layout_home><Dashboard /></Layout_home>} />
        <Route path="/calendar" element={<Layout_home><Calendar /></Layout_home>} />
        <Route path="/reminder" element={<Layout_home><ReminderPage /></Layout_home>} />
        <Route path="/account" element={<Layout_home><Account /></Layout_home>} />
        
        
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
