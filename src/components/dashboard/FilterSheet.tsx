"use client";

interface FilterSheetProps {
  isOpen: boolean;
  currentRadiusKm: number;
  minRadiusKm?: number;
  maxRadiusKm?: number;
  onClose: () => void;
  onApply: (radiusKm: number) => void;
  onChangeRadiusKm: (radiusKm: number) => void;
  defaultRadiusKm?: number;
}

export function FilterSheet({ isOpen, currentRadiusKm, minRadiusKm = 1, maxRadiusKm = 10, onClose, onApply, defaultRadiusKm = 3, onChangeRadiusKm }: FilterSheetProps) {
  
  const handleApply = () => {
    onApply(currentRadiusKm);
  };

  const handleClear = () => {
    const resetValue = defaultRadiusKm ?? minRadiusKm;
    onChangeRadiusKm(resetValue);
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-pointer-events max-w-md mx-auto ${isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      {/* Fondo difuminado */}
      <div
        className={`absolute inset-0 bg-tertiary-1/50 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* Sheet inferior */}
      <div
        className={`absolute inset-x-0 bottom-0 transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl pt-4 px-6 pb-8">
          {/* Handle superior */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1.5 rounded-full bg-gray-200" />
          </div>
          <div>
            {/*TODO imprimir objeto con todos los props y su valor */}
            <pre className="text-xs text-gray-500">{JSON.stringify({ isOpen, currentRadiusKm, minRadiusKm, maxRadiusKm, defaultRadiusKm }, null, 2)}</pre>  
          </div>

          {/* Título y limpiar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary-1">
              Filtros de Búsqueda
            </h2>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-medium text-tertiary-1"
            >
              Limpiar
            </button>
          </div>

          {/* Slider de radio */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Radio de Búsqueda
              </span>
              <span className="text-2xl font-semibold text-primary-1">
                {currentRadiusKm} km
              </span>
            </div>

            <div className="mt-2">
              <input
                type="range"
                min={minRadiusKm}
                max={maxRadiusKm}
                step={1}
                value={currentRadiusKm}
                onChange={(e) => onChangeRadiusKm(Number(e.target.value))}
                className="w-full accent-tertiary-1"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{minRadiusKm} km</span>
                <span>{maxRadiusKm} km</span>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="range"
                min={1}
                max={20}
                className="w-full accent-tertiary-1"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{minRadiusKm} km</span>
                <span>{maxRadiusKm} km</span>
              </div>
            </div>
          </div>

          {/* Botón aplicar */}
          <button
            type="button"
            onClick={handleApply}
            className="mt-8 w-full rounded-2xl bg-tertiary-1 py-3 text-center text-lg font-semibold text-white shadow-lg shadow-tertiary-1/40"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

