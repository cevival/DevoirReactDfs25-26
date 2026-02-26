import { useEffect, useMemo, useState } from "react";
import { conferencesApi } from "../../services/api";
import styles from "./AdminConferencesPage.module.css";

const emptyForm = {
  title: "",
  date: "",
  description: "",
  img: "",
  content: "",
  duration: "",
  mainColor: "#ffffff",
  secondColor: "#0f172a",
};

const getConferenceId = (conference) => conference?.id ?? conference?._id;

const toConferencePayload = (formValues) => ({
  title: formValues.title,
  date: formValues.date,
  description: formValues.description,
  img: formValues.img,
  content: formValues.content,
  duration: formValues.duration,
  speakers: [],
  stakeholders: [],
  design: {
    mainColor: formValues.mainColor,
    secondColor: formValues.secondColor,
  },
});

export function AdminConferencesPage() {
  const [conferences, setConferences] = useState([]);
  const [formValues, setFormValues] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const editingConference = useMemo(
    () =>
      conferences.find(
        (conference) => getConferenceId(conference) === selectedId,
      ) ?? null,
    [conferences, selectedId],
  );

  const loadConferences = async () => {
    setIsLoading(true);

    try {
      const data = await conferencesApi.getAll();
      setConferences(Array.isArray(data) ? data : []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setSelectedId(null);
    setFormValues(emptyForm);
  };

  const loadConferenceIntoForm = (conference) => {
    setSelectedId(getConferenceId(conference));
    setFormValues({
      title: conference?.title ?? "",
      date: conference?.date ?? "",
      description: conference?.description ?? "",
      img: conference?.img ?? "",
      content: conference?.content ?? "",
      duration: conference?.duration ?? "",
      mainColor: conference?.design?.mainColor ?? "#ffffff",
      secondColor: conference?.design?.secondColor ?? "#0f172a",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = toConferencePayload(formValues);

    if (selectedId) {
      await conferencesApi.update(selectedId, payload);
    } else {
      await conferencesApi.create(payload);
    }

    resetForm();
    await loadConferences();
  };

  const handleDelete = async (id) => {
    await conferencesApi.remove(id);

    if (selectedId === id) {
      resetForm();
    }

    await loadConferences();
  };

  return (
    <section className={styles.layout}>
      <h1 className={styles.title}>Administration des conférences</h1>

      <form className={styles.panel} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              name="title"
              className={styles.input}
              value={formValues.title}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              className={styles.input}
              value={formValues.date}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="duration">Durée</label>
            <input
              id="duration"
              name="duration"
              className={styles.input}
              value={formValues.duration}
              onChange={handleFieldChange}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="img">Image (URL)</label>
            <input
              id="img"
              name="img"
              className={styles.input}
              value={formValues.img}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="mainColor">Couleur principale</label>
            <input
              id="mainColor"
              name="mainColor"
              type="color"
              className={styles.input}
              value={formValues.mainColor}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="secondColor">Couleur secondaire</label>
            <input
              id="secondColor"
              name="secondColor"
              type="color"
              className={styles.input}
              value={formValues.secondColor}
              onChange={handleFieldChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            value={formValues.description}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="content">Contenu</label>
          <textarea
            id="content"
            name="content"
            className={styles.textarea}
            value={formValues.content}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.button} type="submit">
            {selectedId ? "Mettre à jour" : "Créer la conférence"}
          </button>
          {selectedId && (
            <button
              className={styles.secondary}
              type="button"
              onClick={resetForm}
            >
              Annuler l’édition
            </button>
          )}
        </div>
      </form>

      <section className={styles.panel}>
        <h2>Conférences existantes</h2>

        {isLoading ? <p>Chargement...</p> : null}

        {!isLoading && conferences.length === 0 ? (
          <p>Aucune conférence.</p>
        ) : null}

        <ul className={styles.list}>
          {conferences.map((conference) => {
            const id = getConferenceId(conference);

            return (
              <li key={id} className={styles.item}>
                <div>
                  <strong>{conference.title}</strong>
                  <div>{conference.date}</div>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => loadConferenceIntoForm(conference)}
                  >
                    Éditer
                  </button>
                  <button
                    type="button"
                    className={styles.danger}
                    onClick={() => handleDelete(id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {editingConference ? (
        <p>Édition en cours : {editingConference.title}</p>
      ) : null}
    </section>
  );
}
