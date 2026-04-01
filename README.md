# Digital Alert Hub Frontend

Aplicacion web del proyecto Digital Alert Hub. Este frontend consume la API del backend para autenticacion, gestion de alertas, administracion, reportes y vistas publicas de consulta.

## Estado actual

- Construido con React, TypeScript y Vite
- Sesion basada en cookie `HttpOnly` emitida por el backend
- Login con Google delegado al backend
- Ruteo protegido por autenticacion y rol
- Integracion con Google Maps y reCAPTCHA
- Despliegue pensado para Vercel

## Stack principal

| Tecnologia | Uso |
| --- | --- |
| React 19 | UI |
| TypeScript | Tipado |
| Vite | Dev server y build |
| React Router | Ruteo SPA |
| Axios | Cliente HTTP |
| Bootstrap | Base visual |
| Recharts | Reportes y graficas |

## Requisitos previos

- Node.js 18 o superior
- npm
- Backend disponible localmente o desplegado

## Variables de entorno

El frontend ya no necesita `VITE_GOOGLE_CLIENT_ID`. El login con Google redirige al backend.

Variables usadas actualmente:

```env
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
VITE_RECAPTCHA_SITE_KEY=tu_site_key_de_recaptcha
```

Mas detalle en [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md).

## Instalacion

```bash
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Ejecucion local

```bash
npm run dev
```

La aplicacion quedara disponible en `http://localhost:5173`.

## Flujo de autenticacion

- El frontend usa `axios` con `withCredentials: true`
- La sesion se hidrata con `GET /auth/session`
- El login con Google redirige al backend en `/auth/google`
- El callback del frontend recibe un `code` temporal y lo canjea a traves del backend
- No se guardan tokens en `localStorage` ni `sessionStorage`

## Rutas principales

| Ruta | Acceso |
| --- | --- |
| `/` | Publico |
| `/login` | Publico |
| `/register` | Publico |
| `/quienes-somos` | Publico |
| `/contacto` | Publico |
| `/alertas/:id` | Publico |
| `/forgot-password` | Publico |
| `/reset-password/:token` | Publico |
| `/auth/callback` | Publico |
| `/admin` | Privado |
| `/crear-alertas` | Privado |
| `/perfil` | Privado |
| `/perfil/cambiar-contrasena` | Privado |
| `/admin/users` | Solo administrador |
| `/admin/roles` | Solo administrador |
| `/jac/alertas` | Administrador, ciudadano o JAC |
| `/reportes` | Administrador, ciudadano o JAC |

## Documentacion

La documentacion tecnica del frontend queda centralizada en [docs/README.md](./docs/README.md).

Para la documentacion del backend y flujos compartidos:

- [../digital-alert-hub-backend/README.md](../digital-alert-hub-backend/README.md)
- [../digital-alert-hub-backend/docs/README.md](../digital-alert-hub-backend/docs/README.md)

## Contribucion

1. Crear una rama desde `dev`
2. Realizar cambios y pruebas
3. Abrir Pull Request con contexto funcional y tecnico

## Licencia

Proyecto academico SENA - Digital Alert Hub.
