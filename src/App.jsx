import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout_home><Home /></Layout_home>} />
        <Route path="/About" element={<Layout><About /></Layout>} />
        <Route path="/Login" element={<Layout_home><Login/></Layout_home>}/>
        <Route path="/Signup" element={<Layout><Signup/></Layout>}/>
        <Route path="/Forgot_passwords" element={<Layout><Forgot_passwords/></Layout>}/>
      </Routes>
      <Routes element={<ProtectedRoute/>}>
        <Route path="/Dashboard" element={<Layout_home><Dashboard/></Layout_home>}/>
        <Route path="/calendar" element={<Layout_home><Calendar/></Layout_home>}/>
        <Route path="/reminder" element={<Layout_home><Reminder/></Layout_home>}/>
        <Route path="/account" element={<Layout_home><Account/></Layout_home>}/>
        <Route path="/QandA" element={<Layout_home><QandA/></Layout_home>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
