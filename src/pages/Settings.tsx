import { User, LogOut } from "lucide-react";
import Header from "../components/Header.tsx";
import ProfilePhoto from "../components/ProfilePhoto";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[#724EBF]">Configurações</h1>
          <p className="text-sm text-gray-500">Gerencie as informações da sua conta</p>
        </header>

        {/* Card principal */}
        <div className="bg-white rounded-xl shadow p-6">
          {/* Perfil */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <ProfilePhoto />
            <div className="text-center sm:text-left">
              <h1 className="text-lg font-semibold">Usuário</h1>
            </div>
          </div>

          {/* Formulário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                placeholder="Nome do Usuário"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input
                type="text"
                placeholder="Gerente / Usuário"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#724EBF] outline-none"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <button className="flex items-center gap-2 text-red-600 hover:underline">
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>

            <button className="px-8 py-3 rounded-lg bg-[#724EBF] text-white font-semibold hover:bg-[#5a3a9f] transition">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
