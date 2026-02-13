type Props = {
  onRetry: () => void;
};

export function PermissionBanner({ onRetry }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-center mx-4 mt-10">
      <div className="text-4xl mb-3">📍</div>
      <h3 className="text-lg font-bold text-amber-900 mb-2">
        Ubicación necesaria
      </h3>
      <p className="text-sm text-amber-700 mb-6">
        Para mostrarte los precios de gasolina cerca de ti, necesitamos acceso a tu ubicación.
      </p>
      
      <button 
        onClick={onRetry}
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-full transition-colors w-full"
      >
        Intentar de nuevo
      </button>
      
      <p className="text-xs text-amber-600/70 mt-4">
        Si denegaste el permiso anteriormente, tendrás que habilitarlo manualmente en la configuración del navegador (ícono del candado 🔒).
      </p>
    </div>
  );
}