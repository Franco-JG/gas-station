import { StationWithDistance } from '@/types'


export const StationCard = ({ creId, name, prices, distance, lat, lng }: StationWithDistance) => {

  const routeUrl = "https://www.google.com/maps/dir/?api=1&destination="

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3 gap-3">
        {/* left side */}
        <div className='flex flex-1 min-w-0 items-center gap-3'>
          {/* Placeholder para el logo o imagen de la estación */}
          <span className='shrink-0 w-12 h-12 bg-tertiary-6 animate-pulse transition-colors ease-in rounded-sm'></span>
          {/* Nombre de la estación con efecto marquee*/}
          <div className="min-w-0 overflow-hidden">
            {/* ID CRE de la estación */}
            <span className="text-xs font-bold text-gray-400 uppercase">{creId}</span>
            {/* Nombre de la estación */}
            <div className="relative overflow-hidden mask-fade">
              <div className="animate-marquee">
                <h3 className="border-red-500 font-bold text-lg text-title leading-none whitespace-nowrap pr-8">
                  {name}
                </h3>
                <h3 className="font-bold text-lg text-title leading-none whitespace-nowrap pr-8" aria-hidden="true">
                  {name}
                </h3>
              </div>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="text-left">
          { 
            prices.find(p => p.type === 'regular') &&
            (
              <div className="text-2xl font-black text-primary-1">
                ${(prices.find(p => p.type === 'regular')!.price / 100).toFixed(2)}
              </div>
            )
          }
          <div className="text-xs font-bold uppercase text-label">Regular</div>
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
        <button
          onClick={() => window.open(`${routeUrl}${lat},${lng}`, '_blank')}
          className="cursor-pointer px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors">
          Ver Mapa
        </button>
      </div>
    </div>
  )
}
