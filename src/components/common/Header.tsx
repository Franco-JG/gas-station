"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { LuSettings2 } from "react-icons/lu";

interface HeaderProps {
  onOpenFilters?: () => void;
}

export function Header({ onOpenFilters }: HeaderProps) {

  const { data: session } = useSession();

  const userName = session?.user?.name;
  const userImg = session?.user?.image;

  return (
    <header className="border-b border-b-primary-6 bg-white p-4 sticky inset-0 z-10 flex justify-between items-center">
      {(userImg ) ? (<Image
        unoptimized
        src={userImg}
        alt={userName+" avatar"}
        width={32}
        height={32}
        className="rounded-full max-h-8"
      />) : (<div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200">
      </div>)}
      <h1 className="text-xl font-bold text-primary-1">
        <span className="text-title">Gas</span>México
      </h1>
      <LuSettings2
        onClick={onOpenFilters}
        size={30}
        className="text-tertiary-1 cursor-pointer" />
    </header>
  )
}
