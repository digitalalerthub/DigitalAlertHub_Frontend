import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { getRecaptchaToken, isRecaptchaEnabled } from "../../config/recaptcha";
import { validatePassword } from "../../utils/userValidation";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>(
    {}
  );
  const isActivationMode = searchParams.get("mode") === "activation";

  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      if (!token) {
        if (isMounted) {
          toast.error("El enlace es invalido o expiro.");
          navigate("/login");
          setIsCheckingToken(false);
        }
        return;
      }

      try {
        await api.get(`/auth/reset-password/${token}`);

        if (isMounted) {
          setIsCheckingToken(false);
        }
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : null;

        if (isMounted) {
          toast.error(
            typeof message === "string"
              ? message
              : "El enlace es invalido o expiro."
          );
          navigate("/login");
          setIsCheckingToken(false);
        }
      }
    };

    void validateToken();

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  const validateForm = (): { isValid: boolean; firstError: string | null } => {
    const nextErrors: { password?: string; confirmPassword?: string } = {};
    const passwordError = validatePassword(password);

    if (passwordError) {
      nextErrors.password = passwordError;
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Debes confirmar la contrasena";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Las contrasenas no coinciden";
    }

    setErrors(nextErrors);
    const firstError = nextErrors.password || nextErrors.confirmPassword || null;

    return {
      isValid: Object.keys(nextErrors).length === 0,
      firstError,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      if (validation.firstError) {
        toast.error(validation.firstError);
      }
      return;
    }

    try {
      const captchaToken = isRecaptchaEnabled
        ? await getRecaptchaToken(
            isActivationMode ? "set_password" : "password_reset"
          )
        : null;

      await api.post(`/auth/reset-password/${token}`, {
        nuevaContrasena: password.trim(),
        captchaToken,
      });

      toast.success(
        isActivationMode
          ? "Cuenta activada correctamente. Ya puedes iniciar sesion."
          : "Contrasena restablecida correctamente."
      );
      navigate("/login");
    } catch {
      toast.error("Error al restablecer la contrasena, intentalo nuevamente");
    }
  };

  if (isCheckingToken) {
    return (
      <div className="login-background d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow p-4 text-center"
          style={{ width: "360px", borderRadius: "15px" }}
        >
          <div className="spinner-border text-primary mx-auto mb-3" role="status" />
          <h3 className="fw-bold mb-2">Validando enlace</h3>
          <p className="text-muted mb-0">
            Estamos verificando que el enlace siga disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-background d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "360px", borderRadius: "15px" }}
      >
        <div className="text-center mb-3">
          <i className="bi bi-arrow-repeat fs-1 text-primary"></i>
        </div>
        <h3 className="text-center mb-4 fw-bold">
          {isActivationMode ? "Activa tu cuenta" : "Actualizar Contrasena"}
        </h3>

        {isActivationMode && (
          <p className="text-center text-muted small">
            Define tu contrasena para activar el acceso a la plataforma.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="position-relative mb-3">
            <i className="bi bi-arrow-counterclockwise position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((current) => ({ ...current, password: undefined }));
                }
              }}
              required
              className={`form-control ps-5 ${errors.password ? "is-invalid" : ""}`}
              placeholder="Nueva Contrasena"
              minLength={8}
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>
          <div className="position-relative mb-3">
            <i className="bi bi-lock position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((current) => ({
                    ...current,
                    confirmPassword: undefined,
                  }));
                }
              }}
              required
              className={`form-control ps-5 ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              placeholder="Confirma la nueva contrasena"
              minLength={8}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center mb-3">
            <button type="submit" className="btn btn-success">
              {isActivationMode ? "Activar cuenta" : "Cambiar contrasena"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
