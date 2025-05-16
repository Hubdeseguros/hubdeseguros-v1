# Hub de Seguros

## Descripción General
Este es el repositorio del proyecto Hub de Seguros, una aplicación web moderna construida con tecnologías de vanguardia.

## Estructura del Proyecto

### Directorios Principales
- `/src`: Código fuente principal
  - `components`: Componentes reutilizables
  - `features`: Funcionalidades específicas de la aplicación
  - `hooks`: Custom React Hooks
  - `integrations`: Integraciones con servicios externos
  - `layouts`: Componentes de layout
  - `lib`: Utilidades y funciones compartidas
  - `pages`: Páginas de la aplicación
  - `routes`: Configuración de rutas
  - `types`: Definiciones de tipos TypeScript

- `/public`: Archivos estáticos
- `/supabase`: Configuración y scripts de Supabase

## Tecnologías Principales

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Radix UI
- React Router
- React Query

### Backend
- Supabase

### Herramientas de Desarrollo
- ESLint
- Prettier
- Vite
- PostCSS

## Requisitos
- Node.js (versión recomendada: 18.x)
- npm o yarn

## Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/Hubdeseguros/hubdeseguros-v1.git
cd hubdeseguros-v1
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con las credenciales necesarias
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Scripts Disponibles
- `npm run dev`: Iniciar el servidor de desarrollo
- `npm run build`: Crear una build de producción
- `npm run preview`: Previsualizar la build de producción
- `npm run lint`: Ejecutar ESLint

## Estructura de Componentes
La aplicación utiliza una arquitectura modular basada en características (feature-based architecture):

```
src/
├── components/     # Componentes reutilizables
├── features/       # Funcionalidades específicas
├── hooks/         # Custom React Hooks
├── integrations/   # Integraciones externas
├── layouts/       # Layouts de la aplicación
├── lib/           # Utilidades y funciones
├── pages/         # Páginas de la aplicación
└── types/         # Tipos TypeScript
```

## Estilos y UI
- Tailwind CSS para estilos
- shadcn/ui para componentes UI
- Radix UI para componentes de accesibilidad
- Tailwind Typography para tipografía

## Configuración de Supabase
La aplicación utiliza Supabase como backend. Las credenciales y configuración se deben definir en el archivo `.env`.

## Contribución
1. Crear una rama para nuevas características:
```bash
git checkout -b feature/nombre-caracteristica
```

2. Realizar los cambios necesarios

3. Commitear los cambios:
```bash
git commit -m "feat: descripción de la característica"
```

4. Crear un Pull Request

## Licencia
MIT
