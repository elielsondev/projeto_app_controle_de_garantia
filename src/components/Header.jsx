import perfilIcon from "../assets/perfil.png"

const Header = () => {
  return (
    <header className="flex justify-between items-center px-5 h-[60px] bg-purple-800 text-black shadow">
      <button>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6H21V8H3V6Z" />
        </svg>
      </button>
      <button
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="perfil"
              >
                <img
                  src={perfilIcon}
                  alt="perfil"
                  className="w-6 h-6 object-contain"
                />
              </button>
    </header>
  );
};

export default Header;
