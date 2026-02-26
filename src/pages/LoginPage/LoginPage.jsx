import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "../../components";
import { ROUTES } from "../../constants/routes";
import { useAuth, useToast } from "../../hooks";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
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
      toast.success("Connexion réussie !");
      navigate(ROUTES.HOME, { replace: true });
      // toast.error déjà affiché par LoginForm
    } catch (err) {
      // toast.error déjà affiché par LoginForm
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <section className={styles.wrapper}>
          <h1 className={styles.title}>Connexion</h1>
          <div
            className={styles.testUsers}
            style={{
              marginBottom: 16,
              background: "#f3f4f6",
              borderRadius: 8,
              padding: "12px 16px",
              fontSize: "0.95em",
            }}
          >
            <strong>Comptes de test :</strong>
            <br />
            <span style={{ color: "#2563eb" }}>admin</span> /{" "}
            <span style={{ color: "#059669" }}>toto</span>
            <br />
            <span style={{ color: "#2563eb" }}>user</span> /{" "}
            <span style={{ color: "#059669" }}>toto</span>
          </div>
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
