import { useEffect, useMemo, useState } from "react";
import { conferencesApi } from "../../services/api";
import styles from "./AdminConferencesPage.module.css";

const ITEMS_PER_PAGE = 8;

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

const getConferenceId = (conference) => conference?._id ?? conference?.id;

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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conferences;
    return conferences.filter(
      (c) =>
        (c.title ?? "").toLowerCase().includes(q) ||
        (c.date ?? "").toLowerCase().includes(q) ||
        (c._id ?? c.id ?? "").toLowerCase().includes(q),
    );
  }, [conferences, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => setCurrentPage(page);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (!window.confirm("Supprimer cette conference ?")) return;
    await conferencesApi.remove(id);
    if (selectedId === id) resetForm();
    await loadConferences();
  };

  return (
    <section className={styles.layout}>
      <h1 className={styles.pageTitle}>
        Admin <span>Conferences</span>
      </h1>

      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2 className={styles.panelTitle}>
          {selectedId ? "Modifier la conference" : "Ajouter une conference"}
        </h2>

        {editingConference && (
          <div className={styles.editingBanner}>
            Edition en cours :&nbsp;<strong>{editingConference.title}</strong>
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
            <label className={styles.label} htmlFor="duration">Duree</label>
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
              placeholder="https://..."
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
            placeholder="Resume en quelques phrases..."
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="content">Contenu detaille</label>
          <textarea
            id="content"
            name="content"
            className={styles.textarea}
            value={formValues.content}
            onChange={handleFieldChange}
            placeholder="Description complete de la conference..."
            required
          />
        </div>

        <div className={styles.formActions}>
          <button className={styles.button} type="submit">
            {selectedId ? "Mettre a jour" : "+ Creer la conference"}
          </button>
          {selectedId && (
            <button className={styles.secondary} type="button" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </form>

      <section className={styles.panel}>
        <div className={styles.listHeader}>
          <h2 className={styles.panelTitle} style={{ margin: 0, border: 0, padding: 0 }}>
            Conferences existantes
          </h2>
          {!isLoading && (
            <span className={styles.countBadge}>
              {filtered.length} / {conferences.length}
            </span>
          )}
        </div>

        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Rechercher par titre, date, _id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher une conference"
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")} type="button">
              x
            </button>
          )}
        </div>

        {isLoading && <p className={styles.loading}>Chargement...</p>}

        {!isLoading && filtered.length === 0 && (
          <div className={styles.empty}>
            {search ? `Aucun resultat pour "${search}".` : "Aucune conference pour le moment."}
          </div>
        )}

        <ul className={styles.list}>
          {paginated.map((conference) => {
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
                  <div className={styles.itemThumbPlaceholder}>mic</div>
                )}

                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{conference.title}</div>
                  <div className={styles.itemMeta}>
                    <span>{conference.date}</span>
                    {conference.duration && <span>{conference.duration}</span>}
                    <span className={styles.itemId}>{id}</span>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => loadConferenceIntoForm(conference)}
                  >
                    Editer
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

        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              &larr;
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              &rarr;
            </button>
          </nav>
        )}

        {!isLoading && filtered.length > 0 && totalPages > 1 && (
          <p className={styles.pageInfo}>
            Page {currentPage} / {totalPages}
          </p>
        )}
      </section>
    </section>
  );
}