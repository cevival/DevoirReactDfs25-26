import { useEffect, useState } from "react";
import { usersApi } from "../../services/api";
import { useToast } from "../../hooks";
import styles from "./AdminUsersPage.module.css";

export function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (id) => {
    setActionLoading(id + "_promote");
    try {
      await usersApi.promoteToAdmin(id);
      await loadUsers();
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm(`Supprimer l'utilisateur « ${id} » ?`)) return;
    setActionLoading(id + "_delete");
    try {
      await usersApi.deleteUser(id);
      await loadUsers();
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Utilisateurs</h1>
        <span className={styles.count}>
          {users.length} membre{users.length === 1 ? "" : "s"}
        </span>
      </div>

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
