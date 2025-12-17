import { useState } from "react";
import userIcon from "../assets/userIcon.png";
import { Squash as Hamburger } from "hamburger-react";
import Sidebar from "./Sidebar";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-8 h-[60px] bg-linear-to-r from-[#724EBF] via-[#724EBF] via-11% to-[rgba(81,31,191,0.98)] shadow">
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
            src={userIcon}
            alt="perfil"
            className="w-7 h-7 object-contain"
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