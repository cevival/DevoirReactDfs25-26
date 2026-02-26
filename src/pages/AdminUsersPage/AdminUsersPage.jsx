import { useEffect, useState } from "react";
import { usersApi } from "../../services/api";
import styles from "./AdminUsersPage.module.css";

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (id) => {
    setActionLoading(id + "_promote");
    setError("");
    try {
      await usersApi.promoteToAdmin(id);
      await loadUsers();
    } catch {
      setError(`Échec de la promotion de « ${id} ».`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Supprimer l'utilisateur « ${id} » ?`)) return;
    setActionLoading(id + "_delete");
    setError("");
    try {
      await usersApi.deleteUser(id);
      await loadUsers();
    } catch {
      setError(`Échec de la suppression de « ${id} ».`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Utilisateurs</h1>
        <span className={styles.count}>
          {users.length} membre{users.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {isLoading && <p className={styles.loading}>Chargement...</p>}

      <ul className={styles.list}>
        {users.map((user) => {
          const uid = user.id ?? user._id;
          const isAdmin = user.type === "admin";
          return (
            <li key={uid} className={styles.item}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{uid}</span>
                <span
                  className={`${styles.badge} ${isAdmin ? styles.badgeAdmin : styles.badgeUser}`}
                >
                  {user.type}
                </span>
              </div>
              <div className={styles.actions}>
                {isAdmin ? (
                  <span className={styles.adminTag}>Admin</span>
                ) : (
                  <button
                    type="button"
                    className={styles.promoteButton}
                    disabled={actionLoading === uid + "_promote"}
                    onClick={() => handlePromote(uid)}
                  >
                    {actionLoading === uid + "_promote"
                      ? "..."
                      : "Promouvoir admin"}
                  </button>
                )}
                <button
                  type="button"
                  className={styles.deleteButton}
                  disabled={actionLoading === uid + "_delete"}
                  onClick={() => handleDelete(uid)}
                >
                  {actionLoading === uid + "_delete" ? "..." : "Supprimer"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
