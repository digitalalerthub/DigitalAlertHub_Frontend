# Seguridad del Frontend

## Resumen ejecutivo

El frontend de Digital Alert Hub ya no depende de almacenamiento de tokens en el navegador y opera con una sesion basada en cookie `HttpOnly` administrada por el backend. La postura actual reduce los riesgos de robo de token por XSS, exposicion de JWT en URLs y redirecciones inseguras posteriores al login.

## Controles implementados

### 1. Sesion por cookie `HttpOnly`

- El cliente HTTP usa `withCredentials: true` en [`src/services/api.ts`](../src/services/api.ts).
- La aplicacion no persiste tokens en `localStorage` ni `sessionStorage`.
- La sesion se hidrata con `GET /auth/session` desde [`src/context/AuthProvider.tsx`](../src/context/AuthProvider.tsx).

Impacto:

- Reduce el acceso del JavaScript del navegador a credenciales de sesion.
- Disminuye el impacto de un XSS respecto al modelo anterior basado en `localStorage`.

### 2. Login con Google sin JWT en URL

- El boton de Google redirige al backend en [`src/components/Auth/GoogleButton.tsx`](../src/components/Auth/GoogleButton.tsx).
- El callback del frontend trabaja con un `code` temporal y no con un token persistente.

Impacto:

- Evita exponer JWT en historial del navegador, logs, analytics o `Referer`.

### 3. Saneamiento de redirecciones internas

- El helper [`src/utils/navigation.ts`](../src/utils/navigation.ts) limita `redirect` a rutas internas validas.

Impacto:

- Reduce superficie para open redirect y redirecciones ambiguas tras login o registro.

### 4. Headers de seguridad en despliegue

- [`vercel.json`](../vercel.json) define:
  - `Content-Security-Policy`
  - `Referrer-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Permissions-Policy`

Impacto:

- Restringe carga de recursos a origenes conocidos.
- Dificulta clickjacking y sniffing de contenido.
- Reduce fuga de contexto entre sitios.

### 5. Rutas protegidas en cliente

- [`src/components/Route/PrivateRoute.tsx`](../src/components/Route/PrivateRoute.tsx) protege vistas autenticadas.
- [`src/components/Route/RoleRoute.tsx`](../src/components/Route/RoleRoute.tsx) protege vistas por rol.

Impacto:

- Mejora experiencia de usuario y reduce exposicion accidental de vistas sensibles.
- No reemplaza controles de autorizacion del backend.

## Decisiones de seguridad relevantes

- El frontend asume que la autorizacion real vive en backend.
- La cookie de sesion debe seguir siendo emitida y revocada por la API.
- Los proveedores externos autorizados actualmente incluyen Google Maps y reCAPTCHA; cualquier nuevo proveedor debe reflejarse en CSP antes de desplegar.

## Riesgos residuales

- La CSP del frontend permite recursos externos necesarios. Si se agrega una nueva integracion sin revisar la politica, se puede abrir superficie innecesaria.
- Las protecciones de rutas en frontend no sustituyen validacion de permisos en backend.
- Un XSS futuro seguiria siendo grave aunque el impacto sea menor que con tokens en `localStorage`.

## Recomendaciones operativas

- Mantener `vercel.json` alineado con los dominios reales consumidos por la aplicacion.
- Revisar cambios en autenticacion junto con el backend, no de forma aislada.
- Validar en cada release que el frontend siga funcionando sin depender de tokens en JS.
