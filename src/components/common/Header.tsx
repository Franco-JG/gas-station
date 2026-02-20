import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LuSettings } from "react-icons/lu"

export async function Header() {

  const session = await auth();

  const userName = session?.user?.name || "User"
  const userImg = session?.user?.image

  return (
    <header className="border-b border-b-primary-6 bg-white p-4 sticky inset-0 z-10 flex justify-between items-center">
      {userImg ? (<Image
        unoptimized
        src={userImg}
        alt={userName}
        width={30}
        height={30}
        className="rounded-full"
      />) : (<div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200">
      </div>)}
      <h1 className="text-xl font-bold text-primary-1">
        <span className="text-title">Gas</span>México
      </h1>
      <LuSettings
        onClick={async () => {
          "use server"
          await signOut()
        }}
        size={30}
        className="text-tertiary-1 cursor-pointer" />
    </header>
  )
}
