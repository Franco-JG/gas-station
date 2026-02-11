import { FuelType, PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1. Limpiar la base de datos (Opcional: para evitar duplicados si lo corres varias veces)
  // Borramos primero precios y favoritos por las llaves foráneas
  await prisma.fuelPrice.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.review.deleteMany()
  await prisma.station.deleteMany()

  console.log('🧹 Base de datos limpiada')

  // 2. Crear una Gasolinera de Prueba (Carretera Uman)
  // Coordenadas Oxxo GAS: 20.916939, -89.702860
  
  const station = await prisma.station.create({
    data: {
      placeId: 1001,             // ID ficticio tipo XML
      creId: 'PL/TEST/UMAN',   // ID ficticio tipo CRE
      name: 'Gasolinera Carretera Uman (Prueba)',
      brand: 'Oxxo GAS',
      address: 'Carretera Uman, Km 5, Yucatan',
      // PRECIOS: Recuerda que son Enteros (Centavos)
      prices: {
        createMany: {
          data: [
            { type: FuelType.regular, price: 2250 }, // $22.50
            { type: FuelType.premium, price: 2490 }, // $24.90
            { type: FuelType.diesel, price: 2300 },  // $23.00
          ]
        }
      }
    }
  })

  // 3. LA MAGIA DE POSTGIS 🗺️
  // Prisma no soporta escribir "geography" directo en el create().
  // Usamos SQL puro para actualizar la ubicación.
  // ST_SetSRID(ST_MakePoint(LONGITUD, LATITUD), 4326)
  
  const lat = 20.916939
  const lng = -89.702860
  
  await prisma.$executeRaw`
    UPDATE stations 
    SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326) 
    WHERE id = ${station.id}
  `;

  console.log(`✅ Gasolinera creada: ${station.name}`)
  console.log(`📍 Coordenadas: [${lat}, ${lng}]`)
  console.log(`📍 Ubicacion: ${station.address}`)

  // 4. Crear otra gasolinera un poco más cerca (Roble)
  // Coordenadas: 20.914594, -89.683126

  const station2 = await prisma.station.create({
    data: {
      placeId: 1002,
      creId: 'PL/TEST/ROBLE',
      name: 'Servicio El Roble (Prueba)',
      brand: 'Shell',
      address: 'Periferico, No. 123, Yucatan',
      prices: {
        createMany: {
          data: [
            { type: FuelType.regular, price: 2310 }, // $23.10
            { type: FuelType.premium, price: 2550 }, // $25.50
          ]
        }
      }
    }
  })

  const lat2 = 20.914594
  const lng2 = -89.683126

  await prisma.$executeRaw`
    UPDATE stations 
    SET location = ST_SetSRID(ST_MakePoint(${lng2}, ${lat2}), 4326) 
    WHERE id = ${station2.id}
  `;
  
  console.log(`✅ Gasolinera creada: ${station2.name}`)
  console.log(`📍 Coordenadas: [${lat2}, ${lng2}]`)
  console.log(`📍 Ubicacion: ${station2.address}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })