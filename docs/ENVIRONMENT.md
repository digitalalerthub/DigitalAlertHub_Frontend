# Variables de Entorno

## Variables vigentes

### `VITE_API_URL`

Base URL de la API backend.

Ejemplo local:

```env
VITE_API_URL=http://localhost:4000/api
```

Uso:

- configuracion base de Axios
- inicio del flujo OAuth Google
- llamadas de autenticacion y datos

### `VITE_GOOGLE_MAPS_API_KEY`

API key usada por los modulos que cargan Google Maps.

Ejemplo:

```env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key
```

### `VITE_RECAPTCHA_SITE_KEY`

Clave publica de reCAPTCHA para formularios que la requieran.

Ejemplo:

```env
VITE_RECAPTCHA_SITE_KEY=tu_site_key
```

## Variables que ya no aplican

### `VITE_GOOGLE_CLIENT_ID`

Ya no es necesaria en el frontend actual. El flujo de Google se inicia contra el backend, que es quien orquesta OAuth.

## Recomendaciones por entorno

### Desarrollo local

- `VITE_API_URL` debe apuntar al backend local o al ambiente de pruebas habilitado para CORS.
- Si se usa login con Google, la URL del frontend debe coincidir con las permitidas en el proveedor y en backend.

### Produccion

- `VITE_API_URL` debe apuntar a la API publica real.
- La CSP de [`vercel.json`](../vercel.json) debe seguir alineada con los dominios externos realmente usados.
- No documentar ni exponer secretos privados del backend en variables `VITE_*`.
