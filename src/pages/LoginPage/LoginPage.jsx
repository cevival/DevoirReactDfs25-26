import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "../../components";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return (
      <Navigate to={isAdmin ? ROUTES.ADMIN_CONFERENCES : ROUTES.HOME} replace />
    );
  }

  const handleLogin = async (id, password) => {
    setIsLoading(true);

    try {
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
          <h1 className={styles.title}>Connexion</h1>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          <p className={styles.registerLink}>
            Pas encore de compte ?{" "}
            <Link to={ROUTES.REGISTER}>Créer un compte</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
