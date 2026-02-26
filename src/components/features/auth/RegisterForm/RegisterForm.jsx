import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./RegisterForm.module.css";

export function RegisterForm({ onSubmit, isLoading }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!id.trim() || !password.trim()) {
      setError("Identifiant et mot de passe sont requis.");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 4) {
      setError("Le mot de passe doit contenir au moins 4 caractères.");
      return;
    }

    try {
      await onSubmit(id.trim(), password);
    } catch (err) {
      setError(
        err?.response?.data?.message ??
          "Inscription impossible. Cet identifiant est peut-être déjà pris.",
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="reg-id">Identifiant</label>
        <input
          id="reg-id"
          className={styles.input}
          value={id}
          autoComplete="username"
          onChange={(event) => setId(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="reg-password">Mot de passe</label>
        <input
          id="reg-password"
          className={styles.input}
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <span className={styles.hint}>4 caractères minimum</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="reg-confirm">Confirmer le mot de passe</label>
        <input
          id="reg-confirm"
          className={styles.input}
          type="password"
          value={confirm}
          autoComplete="new-password"
          onChange={(event) => setConfirm(event.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Inscription..." : "Créer le compte"}
      </button>
    </form>
  );
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

RegisterForm.defaultProps = {
  isLoading: false,
};
