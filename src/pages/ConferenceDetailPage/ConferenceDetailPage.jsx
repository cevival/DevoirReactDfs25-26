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
    return <p>Chargement...</p>;
  }

  if (!conference) {
    return <p>Conférence introuvable.</p>;
  }

  const mainColor = conference?.design?.mainColor ?? "#ffffff";
  const secondColor = conference?.design?.secondColor ?? "#0f172a";

  return (
    <article
      className={styles.card}
      style={{ backgroundColor: mainColor, color: secondColor }}
    >
      <h1>{conference.title}</h1>
      <p className={styles.meta}>{conference.date}</p>
      <p className={styles.meta}>{conference.duration}</p>
      {conference.img ? (
        <img
          className={styles.cover}
          src={conference.img}
          alt={conference.title}
        />
      ) : null}
      <p>{conference.description}</p>

      <section className={styles.block}>
        <h2>Contenu</h2>
        <p>{conference.content}</p>
      </section>

      <section className={styles.block}>
        <h2>Intervenants</h2>
        <ul>
          {toArray(conference.speakers).map((speaker, index) => (
            <li key={`${speaker.firstname}-${speaker.lastname}-${index}`}>
              {speaker.firstname} {speaker.lastname}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.block}>
        <h2>Partenaires</h2>
        <ul>
          {toArray(conference.stakeholders).map((stakeholder, index) => (
            <li
              key={`${stakeholder.firstname}-${stakeholder.lastname}-${index}`}
            >
              {stakeholder.firstname} {stakeholder.lastname}{" "}
              {stakeholder.job ? `- ${stakeholder.job}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
