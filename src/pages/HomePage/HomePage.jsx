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
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Découvrez nos conférences</h1>
        <p className={styles.heroSubtitle}>
          Des événements inspirants pour développer vos compétences
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Prochaines conférences</h2>

        {isLoading ? (
          <p className={styles.loading}>Chargement des conférences...</p>
        ) : null}

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
    </>
  );
}
