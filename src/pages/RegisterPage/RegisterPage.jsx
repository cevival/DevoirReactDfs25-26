import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { RegisterForm } from "../../components";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks";
import styles from "./RegisterPage.module.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleRegister = async (id, password) => {
    setIsLoading(true);

    try {
      const { usersApi } = await import("../../services/api");
      await usersApi.signup(id, password);
      // Auto-connect after successful registration
      await login(id, password);
      navigate(ROUTES.HOME, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <section className={styles.wrapper}>
          <h1 className={styles.title}>Créer un compte</h1>
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
          <p className={styles.loginLink}>
            Déjà un compte ? <Link to={ROUTES.LOGIN}>Se connecter</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
