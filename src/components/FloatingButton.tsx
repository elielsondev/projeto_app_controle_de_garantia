import plusIcon from '../assets/plusIcon.png';
const FloatingButton = () => {
  return (
    <button className="
        fixed bottom-5 translate-x-1/2
        right-10 sm:right-10 sm:translate-x-0
        w-14 h-14 rounded-full
        bg-purple-600 text-white shadow-lg
        flex items-center justify-center
        transition-transform duration-300
        md:hover:-translate-y-1 md:hover:shadow-xl">
      <img src={plusIcon} alt="Adicionar" title='Adicionar Nota' className="w-8 h-8 object-contain" />
    </button>
  );
};

export default FloatingButton;
