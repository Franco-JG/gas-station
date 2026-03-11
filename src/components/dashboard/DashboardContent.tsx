"use client";

import { useState } from "react";
import { StationList, FilterSheet } from "@/components";
import { Header } from "@/components/common/Header";

const DEFAULT_RADIUS_KM = 3;

export function DashboardContent() {
  // Radio aplicado (re-render)
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
      <Header onOpenFilters={openFilters} />

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
