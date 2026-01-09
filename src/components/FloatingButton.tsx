import { Plus } from 'lucide-react';

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
      <Plus className="w-8 h-8" />
    </button>
  );
};

export default FloatingButton;
