import { Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <div className="text-center">
      <Routes>
        <Route path="/" element={ <Welcome /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/register" element={ <Register /> } />
      </Routes>
    </div>
  );
}

export default App;
