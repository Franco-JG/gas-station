import { StationList } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header Fijo */}
      <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-emerald-600">
          Gas<span className="text-gray-800">Tracker</span>
        </h1>
        {/* Placeholder Avatar */}
        <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200"></div> 
      </header>

      {/* El contenido lo maneja StationList */}
      <StationList />
    </main>
  );
}
