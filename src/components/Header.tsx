import { useState } from "react";
import perfilIcon from "../assets/perfil.png";
import { Squash as Hamburger } from "hamburger-react";
import Sidebar from "./Sidebar";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-5 h-15 bg-purple-800 shadow">
        <Hamburger
          size={20}
          color="#ffffff"
          toggled={menuOpen}
          toggle={setMenuOpen}
        />

        <button
          className="p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="perfil"
        >
          <img
            src={perfilIcon}
            alt="perfil"
            className="w-6 h-6 object-contain"
          />
        </button>
      </header>

      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Header;