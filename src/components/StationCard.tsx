import { StationWithDistance } from '@/types'

export const StationCard = ({ brand, name, prices, distance }: StationWithDistance) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{brand}</span>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{name}</h3>
        </div>
        <div className="text-right">
          {/* Precio Principal (Regular/Verde) */}
          {prices.find(p => p.type === 'regular') && (
            <div className="text-2xl font-black text-emerald-600">
              ${(prices.find(p => p.type === 'regular')!.price / 100).toFixed(2)}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">Regular</div>
        </div>
      </div>

      {/* Otros precios */}
      <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
        {prices.map(p => (
          p.type !== 'regular' && (
            <div key={p.id} className="flex gap-1">
              <span className="capitalize font-medium">{p.type}:</span>
              <span className="font-bold">${(p.price / 100).toFixed(2)}</span>
            </div>
          )
        ))}
      </div>

      {/* Footer Card */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          📍 {(distance / 1000).toFixed(1)} km
        </span>
        <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors">
          Ver Mapa
        </button>
      </div>
    </div>
  )
}
