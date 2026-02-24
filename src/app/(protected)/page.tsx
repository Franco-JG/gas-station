import { DashboardContent } from "@/components";

export default async function Home() {

  return (
    <main className="min-h-screen bg-gray-50 shadow-2xl relative pb-40">
      {/* El contenido (header + lista + filtros) lo maneja DashboardContent */}
      <DashboardContent />
    </main>
  );
}
