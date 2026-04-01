# Routing y Autenticacion

## Arquitectura general

La aplicacion usa `BrowserRouter` y centraliza el estado de autenticacion en [`src/context/AuthProvider.tsx`](../src/context/AuthProvider.tsx). El proveedor no guarda credenciales; solo mantiene el estado derivado de la sesion actual.

## Hidratacion de sesion

Al iniciar la aplicacion:

1. `AuthProvider` ejecuta `GET /auth/session`
2. Si la API responde con usuario valido, se marca la sesion como autenticada
3. Si falla, el estado queda anonimo

Esto permite que un refresh del navegador mantenga la sesion si la cookie sigue vigente.

## Login

### Login tradicional

- El formulario autentica contra backend.
- Despues del login, `AuthProvider.login()` vuelve a sincronizar la sesion actual.

### Login con Google

- [`src/components/Auth/GoogleButton.tsx`](../src/components/Auth/GoogleButton.tsx) redirige a `${VITE_API_URL}/auth/google`
- El backend gestiona OAuth y redirige al frontend en `/auth/callback`
- El callback canjea un `code` temporal y luego rehidrata sesion

## Logout

- `AuthProvider.logout()` invoca `POST /auth/logout`
- Luego limpia el estado local
- La revocacion efectiva de la sesion ocurre en backend

## Rutas publicas

- `/`
- `/login`
- `/register`
- `/quienes-somos`
- `/contacto`
- `/alertas/:id`
- `/forgot-password`
- `/reset-password/:token`
- `/auth/callback`

## Rutas privadas

Protegidas por [`src/components/Route/PrivateRoute.tsx`](../src/components/Route/PrivateRoute.tsx):

- `/admin`
- `/crear-alertas`
- `/perfil`
- `/perfil/cambiar-contrasena`

Comportamiento:

- Mientras `isLoading` esta activo, no renderiza la vista protegida
- Si no hay sesion, redirige a `/`

## Rutas por rol

Protegidas por [`src/components/Route/RoleRoute.tsx`](../src/components/Route/RoleRoute.tsx):

### Solo administrador

- `/admin/users`
- `/admin/roles`

### Administrador, ciudadano o JAC

- `/jac/alertas`
- `/reportes`

Comportamiento:

- Si no hay sesion, redirige a `/`
- Si el rol no esta permitido, redirige a `/admin`

## Consideraciones para el equipo

- Si cambian rutas privadas o por rol, actualizar este documento y `App.tsx`.
- Si cambia el flujo de sesion, revisar en conjunto:
  - `AuthProvider.tsx`
  - `api.ts`
  - `Callback.tsx`
  - rutas protegidas
