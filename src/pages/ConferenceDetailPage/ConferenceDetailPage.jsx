import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { conferencesApi } from "../../services/api";
import styles from "./ConferenceDetailPage.module.css";

const toArray = (value) => (Array.isArray(value) ? value : []);

export function ConferenceDetailPage() {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const data = await conferencesApi.getById(id);
        setConference(data);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  if (isLoading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!conference) {
    return <div className={styles.error}>Conférence introuvable.</div>;
  }

  const mainColor = conference?.design?.mainColor ?? "#7c3aed";
  const secondColor = conference?.design?.secondColor ?? "#ede9fe";

  return (
    <div className={styles.container}>
      <article className={styles.card}>
        {conference.img && (
          <div className={styles.hero}>
            <img
              className={styles.cover}
              src={conference.img}
              alt={conference.title}
            />
            <div
              className={styles.overlay}
              style={{
                background: `linear-gradient(to top, ${mainColor}dd 0%, transparent 100%)`,
              }}
            >
              <h1 className={styles.title} style={{ color: secondColor }}>
                {conference.title}
              </h1>
            </div>
          </div>
        )}

        <div className={styles.content}>
          {!conference.img && (
            <h1 className={styles.title} style={{ color: mainColor }}>
              {conference.title}
            </h1>
          )}

          <p className={styles.meta}>
            📅 {conference.date} • ⏱️ {conference.duration}
          </p>

          <p className={styles.description}>{conference.description}</p>

          <section className={styles.block}>
            <h2
              className={styles.blockTitle}
              style={{ color: mainColor, borderBottomColor: `${mainColor}55` }}
            >
              Contenu
            </h2>
            <p className={styles.contentText}>{conference.content}</p>
          </section>

          <section className={styles.block}>
            <h2
              className={styles.blockTitle}
              style={{ color: mainColor, borderBottomColor: `${mainColor}55` }}
            >
              Intervenants
            </h2>
            <ul className={styles.list}>
              {toArray(conference.speakers).map((speaker, index) => (
                <li
                  className={styles.listItem}
                  style={{ borderLeftColor: mainColor }}
                  key={`${speaker.firstname}-${speaker.lastname}-${index}`}
                >
                  {speaker.firstname} {speaker.lastname}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <h2
              className={styles.blockTitle}
              style={{ color: mainColor, borderBottomColor: `${mainColor}55` }}
            >
              Partenaires
            </h2>
            <ul className={styles.list}>
              {toArray(conference.stakeholders).map((stakeholder, index) => (
                <li
                  className={styles.listItem}
                  style={{ borderLeftColor: mainColor }}
                  key={`${stakeholder.firstname}-${stakeholder.lastname}-${index}`}
                >
                  {stakeholder.firstname} {stakeholder.lastname}{" "}
                  {stakeholder.job ? `- ${stakeholder.job}` : ""}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
