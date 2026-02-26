import { Link } from "react-router-dom";
import styles from "./ConferenceCard.module.css";
import PropTypes from "prop-types";

const getConferenceId = (conference) => conference?.id ?? conference?._id;

export function ConferenceCard({ conference }) {
  const id = getConferenceId(conference);

  return (
    <article className={styles.card}>
      {conference?.img && (
        <img
          className={styles.cover}
          src={conference.img}
          alt={conference.title}
        />
      )}
      <div className={styles.body}>
        <h2 className={styles.title}>{conference?.title}</h2>
        <p className={styles.meta}>{conference?.date}</p>
        <p className={styles.meta}>{conference?.description}</p>
        {id && (
          <Link className={styles.link} to={`/conference/${id}`}>
            Voir le détail
          </Link>
        )}
      </div>
    </article>
  );
}

ConferenceCard.propTypes = {
  conference: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    img: PropTypes.string,
  }).isRequired,
};
