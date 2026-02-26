import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./LoginForm.module.css";

export function LoginForm({ onSubmit, isLoading }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!id.trim() || !password.trim()) {
      setError("Identifiant et mot de passe sont requis.");
      return;
    }

    try {
      await onSubmit(id.trim(), password);
    } catch {
      setError("Connexion impossible, vérifie tes identifiants.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="id" className={styles.label}>
          Identifiant
        </label>
        <input
          id="id"
          className={styles.input}
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Mot de passe
        </label>
        <input
          id="password"
          className={styles.input}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

LoginForm.defaultProps = {
  isLoading: false,
};
