import { auth } from "@/auth";
import Image from "next/image";

export async function Header() {

  const session = await auth();

  const userName = session?.user?.name || "User"
  const userImg = session?.user?.image || "/next.svg"

  return (
    <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-primary-1">
          Gas<span className="text-title">Tracker</span>
        </h1>
        {/* Placeholder Avatar */}
        {userImg ? (<Image
          src={userImg}
          alt={userName}
          width={32}
          height={32}
          className="rounded-full"
        /> ) : (<div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200">
        </div>)}
        
      </header>
  )
}
