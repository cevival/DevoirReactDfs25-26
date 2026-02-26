import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../hooks";
import styles from "./MainLayout.module.css";
import PropTypes from "prop-types";

export function MainLayout({ children }) {
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to={ROUTES.HOME} className={styles.brand}>
          <img src="/logo.png" alt="NexTalk" className={styles.logo} />
        </Link>

        <nav className={styles.nav} aria-label="Navigation principale">
          <Link className={styles.link} to={ROUTES.HOME}>
            Accueil
          </Link>
          {isAdmin && (
            <>
              <Link className={styles.link} to={ROUTES.ADMIN_CONFERENCES}>
                Admin conférences
              </Link>
              <Link className={styles.link} to={ROUTES.ADMIN_USERS}>
                Admin utilisateurs
              </Link>
            </>
          )}
        </nav>

        <div className={styles.nav}>
          {isAuthenticated ? (
            <>
              <span className={styles.userInfo}>
                {currentUser?.id ?? "Utilisateur"}
              </span>
              <button type="button" className={styles.button} onClick={logout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link className={styles.link} to={ROUTES.LOGIN}>
                Connexion
              </Link>
              <Link className={styles.link} to={ROUTES.REGISTER}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
