import { NextResponse } from "next/server";
import { syncPricesOnly } from "@/services/cre-sync.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await syncPricesOnly();

    return NextResponse.json({
      success: true,
      message: `Precios actualizados en ${stats.duration}s`,
      stats,
    });
  } catch (error) {
    console.error("❌ Error en sync precios:", error);
    return NextResponse.json(
      { error: "Fallo en sync de precios" },
      { status: 500 }
    );
  }
}