"use client";

import { useState } from "react";
import { StationList, FilterSheet } from "@/components";

const DEFAULT_RADIUS_KM = 3;

export function DashboardContent() {
  // Radio aplicado (se usa para pedir estaciones)
  const [radiusKm, setRadiusKm] = useState<number>(DEFAULT_RADIUS_KM);
  // Radio en el slider (borrador mientras el usuario mueve el control)
  const [draftRadiusKm, setDraftRadiusKm] = useState<number>(DEFAULT_RADIUS_KM);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openFilters = () => {
    // Cuando se abre, el slider parte del valor aplicado actual
    setDraftRadiusKm(radiusKm);
    setIsFilterOpen(true);
  };
  const closeFilters = () => setIsFilterOpen(false);

  const handleApplyFilters = (newRadiusKm: number) => {
    setRadiusKm(newRadiusKm);
    closeFilters();
  };

  return (
    <>
      {/* Botón para abrir filtros */}
      <div className="px-4 pt-4 flex justify-end">
        <button
          type="button"
          onClick={openFilters}
          className="flex items-center gap-2 rounded-full border border-primary-6 bg-white px-4 py-2 text-sm font-medium text-primary-1 shadow-sm"
        >
          Filtros
        </button>
      </div>

      <StationList radiusKm={radiusKm} />

      <FilterSheet
        isOpen={isFilterOpen}
          currentRadiusKm={draftRadiusKm}
        minRadiusKm={1}
        maxRadiusKm={20}
        defaultRadiusKm={DEFAULT_RADIUS_KM}
        onClose={closeFilters}
        onApply={handleApplyFilters}
          onChangeRadiusKm={setDraftRadiusKm}
      />
    </>
  );
}
