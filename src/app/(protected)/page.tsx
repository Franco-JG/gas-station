import { DashboardContent } from "@/components";

export const metadata = {
 title: 'Dashboard - Carga Gasolina',
 description: 'Dashboard de la aplicación Carga Gasolina',
};
export default async function Dashboard() {

  return (
    <main className="min-h-screen bg-gray-50 shadow-2xl relative">
      <DashboardContent />
    </main>
  );
}
