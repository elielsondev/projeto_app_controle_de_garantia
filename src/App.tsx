import { Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NoteScreen from "./pages/NoteScreen";
import RegistrationNote from "./pages/RegistrationNote";
import Trash from "./pages/trash";

function App() {
  return (
    <div className="text-center">
      <Routes>
        <Route path="/" element={ <Welcome /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/note" element={ <NoteScreen /> } />
        <Route path="/registration-note" element={ <RegistrationNote /> } />
        <Route path="/trash" element={<Trash />} />
      </Routes>
    </div>
  );
}

export default App;
