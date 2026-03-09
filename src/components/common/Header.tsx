import { LuSettings2 } from "react-icons/lu";
import { Profile } from "@/components"

interface HeaderProps {
  onOpenFilters?: () => void;
  onOpenProfile?: () => void;
}

export function Header({ onOpenFilters }: HeaderProps) {

  return (
    <header className="border-b border-b-primary-6 bg-white p-4 sticky inset-0 z-10 flex justify-between items-center">
      <Profile/>
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
