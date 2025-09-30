import LoginForm from "../components/LoginForm";

// Página de Login (vista completa)
const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      {/* Inserta el formulario de login */}
      <LoginForm />
    </div>
  );
};

// Exporta la página para poder usarla en el router
export default LoginPage;
