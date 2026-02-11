## Configuración del proyecto

### 1. Levantar la base de datos

Ejecuta el siguiente comando para iniciar la base de datos usando Docker Compose:

```bash
docker compose up -d
```

Esto levantará el contenedor de la base de datos en segundo plano.

### 2. Configurar Prisma

Inicializa Prisma en el proyecto (si aún no existe la configuración):

```bash
pnpm exec prisma init
```

Esto creará los archivos de configuración y el archivo `schema.prisma`.

Luego, edita el archivo `.env` generado para asegurarte de que la variable `DATABASE_URL` apunte a tu base de datos local.

Continúa con la definición de tu modelo en `prisma/schema.prisma` y ejecuta las migraciones según sea necesario.

### 3. Migraciones y generación de cliente

Ejecuta los siguientes comandos para aplicar las migraciones y generar el cliente de Prisma:

```bash
pnpm exec prisma reset
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
```

Esto reiniciará la base de datos, aplicará la migración inicial y generará el cliente de Prisma para tu proyecto.

### 4. Ejecutar el seed de la base de datos

Para poblar la base de datos con datos iniciales, ejecuta:

```bash
pnpm exec prisma db seed
```

Esto correrá el script de seed definido en `prisma/seed.ts`.
