import { useEffect, useState } from "react";
import { ConferenceCard } from "../../components";
import { conferencesApi } from "../../services/api";
import styles from "./HomePage.module.css";

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const data = await conferencesApi.getAll();
        setConferences(Array.isArray(data) ? data : []);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section>
      <h1 className={styles.title}>Conferences</h1>

      {isLoading ? <p>Chargement des conférences...</p> : null}

      {!isLoading && conferences.length === 0 ? (
        <p className={styles.empty}>Aucune conférence pour le moment.</p>
      ) : null}

      <div className={styles.grid}>
        {conferences.map((conference) => {
          const key = conference?.id ?? conference?._id;

          return <ConferenceCard key={key} conference={conference} />;
        })}
      </div>
    </section>
  );
}
