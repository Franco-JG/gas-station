import { auth } from "@/auth";
import { StationList } from "@/components";
import Image from "next/image";


export default async function Home() {

  const session = await auth();

  const userName = session?.user?.name || "User"
  const userImg = session?.user?.image || "/next.svg"

  return (
    <main className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header Fijo */}
      <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-emerald-600">
          Gas<span className="text-gray-800">Tracker</span>
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

      {/* El contenido lo maneja StationList */}
      <StationList />
    </main>
  );
}
