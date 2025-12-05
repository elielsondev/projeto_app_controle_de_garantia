import { Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";

function App() {
  return (
    <div className="text-center">
      <Routes>
        <Route path="/" element={ <Welcome /> } />
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </div>
  );
}

export default App;
