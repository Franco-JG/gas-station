import { LuBuilding2, LuHeart, LuMap } from "react-icons/lu"
import { FaLocationArrow } from "react-icons/fa"
import { StationWithDistance } from '@/types'


export const StationCard = ({ name, prices, distance, lat, lng }: StationWithDistance) => {

  const routeUrl = "https://www.google.com/maps/dir/?api=1&destination="

  return (
    <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header Card */}
      <div className="flex justify-between items-start gap-3">
        {/* left side */}
        <div className='flex flex-1 min-w-0 items-center gap-3'>
          {/* Placeholder para el logo o imagen de la estación */}
          <span className='shrink-0 w-12 h-12 bg-tertiary-6 ease-in rounded-sm flex items-center justify-center'>
            <LuBuilding2 className="text-tertiary-1 text-lg" />
          </span>
          {/* Nombre de la estación con efecto marquee*/}
          <div className="min-w-0 space-y-1">
            {/* Nombre de la estación */}
            <div className="overflow-hidden mask-fade">
              <div className="animate-marquee">
                <h3 className="font-bold text-base text-title leading-none whitespace-nowrap pr-8">
                  {name}
                </h3>
                <h3 className="font-bold text-base text-title leading-none whitespace-nowrap pr-8" aria-hidden="true">
                  {name}
                </h3>
              </div>
            </div>
            {/* ID CRE de la estación */}
            {/* <span className="text-xs font-bold text-gray-400 uppercase">{creId}</span> */}
            {distance && (
              <div className="flex items-center gap-1">
                <FaLocationArrow className="text-subtitle w-2.5" />
                <span className="text-subtitle text-xs">{(distance / 1000).toFixed(1)} km</span>
              </div>
            )
            }

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

      {/* Other prices */}
      <div className="flex gap-3">
        {prices.filter(p => p.type !== 'regular').map(p => (
          <div key={p.id} className="flex basis-1/2 grow-0 text-gray-600 bg-gray p-2 rounded-lg justify-between items-center">
            <span className="uppercase text-[10px] font-bold text-tertiary-4">{p.type}:</span>
            <span className="font-bold text-sm text-title">${(p.price / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Footer Card */}
      <div className="flex gap-2">
        <button
          className="grow cursor-pointer bg-white border-2 border-primary-5 rounded-lg"
          onClick={() => window.open(`${routeUrl}${lat},${lng}`, '_blank')}
          >
          <span className="flex gap-2 items-center justify-center">
            <LuMap className="text-primary-1" strokeWidth={2} size={16} />
            <span className="font-bold text-sm text-primary-1">Ver Mapa</span>
          </span>
        </button>
        <span className="bg-gray rounded-lg p-2">
          <LuHeart size={24} className="text-primary-1"/>
        </span>
      </div>
    </div>
  )
}
