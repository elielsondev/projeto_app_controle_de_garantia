import { Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NoteScreen from "./pages/NoteScreen";

function App() {
  return (
    <div className="text-center">
      <Routes>
        <Route path="/" element={ <Welcome /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/note" element={ <NoteScreen /> } />
      </Routes>
    </div>
  );
}

export default App;
