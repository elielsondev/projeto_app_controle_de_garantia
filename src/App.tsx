import { Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoteScreen from "./pages/NoteScreen";
import RegistrationNote from "./pages/RegistrationNote";
import Trash from "./pages/trash";
import Settings from "./pages/Settings";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { ToastContainer } from "./components/Toast";

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="text-center">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/note" element={<NoteScreen />} />
        <Route path="/registration-note" element={<RegistrationNote />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
