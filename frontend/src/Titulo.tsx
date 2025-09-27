function Titulo() {
  // JSX
  const nombre = "Login";
  if (nombre) {
    return <h1>Hola {nombre}</h1>;
  }
  return <h1>Hola Mundo</h1>;
}

// Siempre debe exportarse
export default Titulo;
