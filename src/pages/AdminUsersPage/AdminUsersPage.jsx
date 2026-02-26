import { useEffect, useState } from "react";
import { usersApi } from "../../services/api";
import styles from "./AdminUsersPage.module.css";

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);

    try {
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (id) => {
    await usersApi.promoteToAdmin(id);
    await loadUsers();
  };

  return (
    <section className={styles.panel}>
      <h1>Administration des utilisateurs</h1>

      {isLoading ? <p>Chargement...</p> : null}

      {!isLoading && users.length === 0 ? <p>Aucun utilisateur.</p> : null}

      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user.id ?? user._id} className={styles.item}>
            <div>
              <strong>{user.id ?? user._id}</strong> — {user.type}
            </div>

            {user.type === "admin" ? (
              <span>Déjà admin</span>
            ) : (
              <button
                type="button"
                className={styles.button}
                onClick={() => handlePromote(user.id ?? user._id)}
              >
                Promouvoir admin
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
