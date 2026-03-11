'use client';
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LuSettings, LuBadgeInfo, LuLogOut } from "react-icons/lu";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string | null;
  userEmail?: string | null;
  userImg?: string | null;
}

const ProfilePopup = ({ isOpen, onClose, userName, userEmail, userImg }: ProfilePopupProps) => {
  const initials =
    userName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "JP";

  return (
    <div
      className={`fixed inset-0 z-40 flex items-start justify-center max-w-md mx-auto transition-all ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Fondo difuminado */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Card flotante */}
      <div
        className={`relative z-50 mt-20 w-[90%] max-w-sm transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95"
        }`}
      >
        <div className="relative rounded-3xl bg-white/95 shadow-2xl px-5 pt-6 pb-4">
          {/* Header del popup: avatar + nombre + email */}
          <div className="flex items-center gap-4 mb-5">
            <div className="h-14 w-14 rounded-full shadow-lg bg-linear-to-br from-tertiary-1 to-primary-3 flex items-center justify-center text-white font-semibold text-lg">
              {userImg ? (
                <Image
                  unoptimized
                  src={userImg}
                  alt={(userName ?? "Usuario") + " avatar"}
                  width={56}
                  height={56}
                  className="rounded-full h-14 w-14 object-cover bg-white"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-primary-1">
                {userName ?? "Juan Pérez"}
              </span>
              <span className="text-xs text-gray-500">
                {userEmail ?? "juan.perez@email.com"}
              </span>
            </div>
          </div>

          <div className="space-y-1 ">
            <button
              type="button"
              className="flex p-1 items-center gap-3 text-sm text-gray-500 opacity-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <LuSettings size={18} />
              </span>
              <span className="font-medium">Configuración</span>
            </button>

            <button
              type="button"
              className="flex p-1 items-center gap-3 text-sm text-gray-500 opacity-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <LuBadgeInfo size={18} />
              </span>
              <span className="font-medium">Ayuda</span>
            </button>
          </div>

          {/* Separador */}
          <div className="h-px w-full bg-gray-200 m-1" />

          {/* Cerrar sesión (única acción real) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              signOut();
            }}
            className="p-1 cursor-pointer flex items-center gap-3 text-sm font-semibold text-red-500 hover:bg-secondary-6 rounded-xl transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
              <LuLogOut size={18} />
            </span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Profile = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name;
  const userImg = session?.user?.image && session.user.image.trim().length > 0 ? session.user.image : null;
  const userEmail = session?.user?.email;
  const initials =
    userName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Avatar que abre el popup */}
      <div onClick={() => setIsOpen(true)} className="h-8 w-8 cursor-pointer rounded-full shadow-sm bg-linear-to-br from-tertiary-1 to-primary-3 flex items-center justify-center text-white font-semibold text-sm">
        {userImg ? (
                <Image
                  unoptimized
                  src={userImg}
                  alt={(userName ?? "Usuario") + " avatar"}
                  width={32}
                  height={32}
                  className="rounded-full h-8 w-8 object-cover bg-white"
                />
              ) : (
                  <span>{initials}</span>
              )}
      </div>

      {/* Popup de perfil — siempre montado, animado con CSS */}
      <ProfilePopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userName={userName}
        userEmail={userEmail}
        userImg={userImg}
      />
    </>
  );
};