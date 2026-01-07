import { CircleCheckBig, FileText } from "lucide-react"

// Componente da tela da nota
function NoteScreen() {

  return (
    <div className="">

      {/* Header */}
      <div className="flex items-center justify-center">
        <div className="flex p-3 rounded-full bg-[#558941]/15 text-[#478E2C] m-10 shadow">
          <CircleCheckBig color="#478E2C" />
          <p className="ml-2 font-medium">Garantia Ativa</p>
        </div>
      </div>

      {/* Image Note */}
      <div className="grid grid-cols-2">
        <div className="border ">
        <FileText size={50} />
        </div>
      </div>
    </div>
  )
}

export default NoteScreen;
