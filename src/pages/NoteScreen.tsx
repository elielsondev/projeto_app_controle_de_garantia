import { useNavigate } from "react-router-dom";
import { CircleCheckBig, FileText, CalendarDays, ClockAlert, Store, Phone, ShieldCheck, CircleArrowLeft, User,} from "lucide-react"
import Header from "../components/Header";

// Componente da tela da nota
function NoteScreen() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      <div className="w-full px-5 sm:px-6 md:px-10 xl:px-20 pb-6 md:pb-10">

        {/* Stats */}
        <div className="relative flex justify-center py-6 md:py-10">
          <CircleArrowLeft
            onClick={handleClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer transition duration-300 ease-out hover:-translate-x-1"
            size={35} />

          <div className="
          flex items-center gap-2 p-3 px-4 py-2 md:p-3 
          rounded-full bg-[#558941]/15 text-[#478E2C] 
          shadow transition duration-300 ease-out hover:-translate-y-1
        ">
            <CircleCheckBig className="w-4 h-4 md:w-5 md:h-5" />
            <p className="font-medium text-ts md:text-sm lg:text-base">Garantia Ativa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

          {/* Image Note */}
          <div className="flex flex-col items-center">
            <div className="w-full bg-[#724EBF]/30 rounded-2xl py-25 sm:py-28 md:py-30 xl:py-35 flex items-center justify-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            </div>

            <button className="mt-2 md:mt-3 font-semibold hover:underline text-sm md:text-base lg:text-lg transition">
              Visualizar em PDF
            </button>
          </div>

          <div className="">
            {/* Details Note */}
            <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">Monitor Dell</h1>
            <p className="mt-1 text-sm md:text-base">
              <span className="font-semibold mr-2">Número da Nota:</span>
              5542
            </p>
            <div className="grid grid-cols-2 mx-7 text-start gap-y-10">

              {/* Purchase Date */}
              <div className="flex flex-row items-start gap-2 mt-10">
                <CalendarDays color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Data de Compra:</p>
                  <p className="text-sm md:text-base">12/08/2023</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2 mt-10">
                <ClockAlert color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Fim da Garantia:</p>
                  <p className="text-sm md:text-base">12/08/2024</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <Store color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Loja:</p>
                  <p className="text-sm md:text-base">Dell</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <Phone color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Contato da Loja:</p>
                  <p className="text-sm md:text-base">(11) 9999-9999</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <ShieldCheck color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Tipo de Garantia:</p>
                  <p className="text-sm md:text-base">Extendida</p>
                </div>
              </div>

              <div className="flex flex-row items-start gap-2">
                <User color="#724EBF" size={35} className="shrink-0" />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm md:text-base">Nota Criada Por:</p>
                  <p className="text-sm md:text-base">Paulinho Rodriguês</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col mt-8 md:mt-12">
          <label htmlFor="notes" className="font-semibold text-xl md:text-2xl mb-2 md:mb-3">Observações:</label>
          <textarea
            name="notes"
            rows={5}
            readOnly
            className="w-full p-3 md:p-4 border border-gray-300 rounded-md text-sm md:text-base resize-none"
            placeholder="Nenhuma observação registrada.
            ">
          </textarea>
          <div className="flex flex-col sm:flex-row justify-start sm:justify-end gap-3 md:gap-4 mt-4 md:mt-5">
            <button className="
              border-2 border-[#724EBF]
              text-[#724EBF] font-medium
              px-10
              py-2
              rounded-3xl
              hover:bg-violet-300
              hover:border-violet-300 
              transition
            ">
              Editar
            </button>

            <button className="
              border-2 border-[#D41414]
              text-[#D41414] font-medium
              px-10
              py-2
              rounded-3xl
              hover:bg-red-200
              hover:border-red-200
              transition
            ">
              Mover para Lixeira
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default NoteScreen;
