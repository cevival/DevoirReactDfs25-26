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
      <h1 className={styles.pageTitle}>
        Admin â€” <span>ConfÃ©rences</span>
      </h1>

      {/* â”€â”€ Formulaire crÃ©ation / Ã©dition â”€â”€ */}
      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2 className={styles.panelTitle}>
          {selectedId ? "Modifier la confÃ©rence" : "Ajouter une confÃ©rence"}
        </h2>

        {editingConference && (
          <div className={styles.editingBanner}>
            âœï¸ Ã‰dition en cours :&nbsp;<strong>{editingConference.title}</strong>
          </div>
        )}

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Titre</label>
            <input
              id="title"
              name="title"
              className={styles.input}
              value={formValues.title}
              onChange={handleFieldChange}
              placeholder="Ex : IA & Futur du Travail"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              className={styles.input}
              value={formValues.date}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="duration">DurÃ©e</label>
            <input
              id="duration"
              name="duration"
              className={styles.input}
              value={formValues.duration}
              onChange={handleFieldChange}
              placeholder="Ex : 2h30"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="img">Image (URL)</label>
            <input
              id="img"
              name="img"
              className={styles.input}
              value={formValues.img}
              onChange={handleFieldChange}
              placeholder="https://â€¦"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="mainColor">Couleur principale</label>
            <div className={styles.colorWrapper}>
              <input
                id="mainColor"
                name="mainColor"
                type="color"
                className={styles.colorInput}
                value={formValues.mainColor}
                onChange={handleFieldChange}
              />
              <span className={styles.colorValue}>{formValues.mainColor}</span>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="secondColor">Couleur secondaire</label>
            <div className={styles.colorWrapper}>
              <input
                id="secondColor"
                name="secondColor"
                type="color"
                className={styles.colorInput}
                value={formValues.secondColor}
                onChange={handleFieldChange}
              />
              <span className={styles.colorValue}>{formValues.secondColor}</span>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">Description courte</label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            value={formValues.description}
            onChange={handleFieldChange}
            placeholder="RÃ©sumÃ© en quelques phrasesâ€¦"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="content">Contenu dÃ©taillÃ©</label>
          <textarea
            id="content"
            name="content"
            className={styles.textarea}
            value={formValues.content}
            onChange={handleFieldChange}
            placeholder="Description complÃ¨te de la confÃ©renceâ€¦"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button className={styles.button} type="submit">
            {selectedId ? "âœ“ Mettre Ã  jour" : "+ CrÃ©er la confÃ©rence"}
          </button>
          {selectedId && (
            <button
              className={styles.secondary}
              type="button"
              onClick={resetForm}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* â”€â”€ Liste des confÃ©rences existantes â”€â”€ */}
      <section className={styles.panel}>
        <div className={styles.listHeader}>
          <h2 className={styles.panelTitle} style={{ margin: 0, border: 0, padding: 0 }}>
            ConfÃ©rences existantes
          </h2>
          {!isLoading && (
            <span className={styles.countBadge}>
              {conferences.length} confÃ©rence{conferences.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading && <p className={styles.loading}>Chargementâ€¦</p>}

        {!isLoading && conferences.length === 0 && (
          <div className={styles.empty}>Aucune confÃ©rence pour le moment.</div>
        )}

        <ul className={styles.list}>
          {conferences.map((conference) => {
            const id = getConferenceId(conference);
            const isEditing = selectedId === id;

            return (
              <li
                key={id}
                className={`${styles.item} ${isEditing ? styles.itemEditing : ""}`}
              >
                {conference.img ? (
                  <img
                    className={styles.itemThumb}
                    src={conference.img}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.itemThumbPlaceholder}>ðŸŽ¤</div>
                )}

                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{conference.title}</div>
                  <div className={styles.itemMeta}>
                    <span>ðŸ“… {conference.date}</span>
                    {conference.duration && <span>â± {conference.duration}</span>}
                    <span>
                      <span
                        className={styles.colorDot}
                        style={{
                          backgroundColor: conference?.design?.mainColor ?? "#7c3aed",
                        }}
                      />
                      {conference?.design?.mainColor ?? "â€”"}
                    </span>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => loadConferenceIntoForm(conference)}
                  >
                    Ã‰diter
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
    </section>
  );
}
