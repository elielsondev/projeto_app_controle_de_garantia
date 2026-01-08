import { CircleCheckBig, FileText, CalendarDays, ClockAlert, Store, Phone, ShieldCheck, } from "lucide-react"

// Componente da tela da nota
function NoteScreen() {

  return (
    <div className="w-full px-4 md:px-10 xl:px-20 pb-10">

      {/* Header */}
      <div className="flex justify-center">
        <div className="
          flex items-center gap-2 p-3 
          rounded-full bg-[#558941]/15 text-[#478E2C] 
          my-10 mb-15 
          shadow transitionduration-300 ease-out hover:-translate-y-2
        ">
          <CircleCheckBig className="w-5 h-5 md:w-6 md:h-6" />
          <p className="font-medium text-sm md:text-base">Garantia Ativa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image Note */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl bg-[#724EBF]/30 rounded-2xl py-20 md:py-27 xl:py-45 flex items-center justify-center">
            <FileText className="w-12 h-12 md:w-16 md:h-16" />
          </div>

          <button className="mt-1 font-semibold hover:underline text-lg">
            Visualizar em PDF
          </button>
        </div>

        <div>
          {/* Details Note */}
          <h1 className="font-semibold mt-1 text-4xl">Monitor Dell</h1>
          <p className="mt-1">
            <span className="font-semibold mr-2">Número da Nota:</span>
            5542
          </p>
          <div className="grid grid-cols-2 mx-10 text-start gap-y-12 mt-5">

            {/* Purchase Date */}
            <div className="flex flex-row items-start gap-4 mt-10">
              <CalendarDays color="#724EBF" size={40} />
              <div className="flex flex-col">
                <p className="font-semibold">Data de Compra:</p>
                <p>12/08/2023</p>
              </div>
            </div>

            <div className="flex flex-row items-start gap-4 mt-10">
              <ClockAlert color="#724EBF" size={40} />
              <div className="flex flex-col">
                <p className="font-semibold">Fim da Garantia:</p>
                <p>12/08/2024</p>
              </div>
            </div>

            <div className="flex flex-row items-start gap-4">
              <Store color="#724EBF" size={40} />
              <div className="flex flex-col">
                <p className="font-semibold">Loja:</p>
                <p>Dell</p>
              </div>
            </div>

            <div className="flex flex-row items-start gap-4">
              <Phone color="#724EBF" size={40} />
              <div className="flex flex-col">
                <p className="font-semibold">Contato da Loja:</p>
                <p>(11) 9999-9999</p>
              </div>
            </div>

            <div className="flex flex-row items-start gap-4">
              <ShieldCheck color="#724EBF" size={40} />
              <div className="flex flex-col">
                <p className="font-semibold">Tipo de Garantia:</p>
                <p>Extendida</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex flex-col mt-15">
        <label htmlFor="notes" className="font-semibold text-2xl">Observações:</label>
        <textarea
          name="notes"
          rows={5}
          readOnly
          className="mt-2 mx-40 p-2 border border-gray-300 rounded-md"
          placeholder="Nenhuma observação registrada.
            ">
        </textarea>
        <div className="flex justify-end mx-42 mt-3 gap-5">
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
  )
}

export default NoteScreen;
