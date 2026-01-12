import { useEffect, useRef, useState } from "react";

const ProfilePhoto = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // Carrega foto salva
  useEffect(() => {
    const savedPhoto = localStorage.getItem("profilePhoto");
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limita tamanho (opcional)
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhoto(base64);
      localStorage.setItem("profilePhoto", base64);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-purple-500 shadow">
        <img
          src={photo || "/avatar-placeholder.png"}
          alt="Foto de perfil"
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-purple-600 text-sm font-medium hover:underline"
      >
        Mudar foto de perfil
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handlePhotoChange}
      />
    </div>
  );
};

export default ProfilePhoto;
