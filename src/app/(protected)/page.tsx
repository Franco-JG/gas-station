import { StationList } from "@/components";
import { Header } from "@/components/common/Header";

export default async function Home() {

  return (
    <main className="min-h-screen bg-gray-50 shadow-2xl relative pb-40">
      {/* Header Fijo */}
      <Header />
      {/* El contenido lo maneja StationList */}
      <StationList />
    </main>
  );
}
