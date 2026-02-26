import { useEffect, useMemo, useState } from "react";
import { ConferenceCard } from "../../components";
import { conferencesApi } from "../../services/api";
import styles from "./HomePage.module.css";

const ITEMS_PER_PAGE = 6;

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [conferences, setConferences] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Réinitialiser la page quand la recherche ou le tri change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = conferences;

    if (q) {
      result = result.filter(
        (c) =>
          (c.title ?? "").toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          (c.content ?? "").toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      const da = new Date(a.date ?? 0);
      const db = new Date(b.date ?? 0);
      return sortOrder === "asc" ? da - db : db - da;
    });

    return result;
  }, [conferences, search, sortOrder]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Découvrez nos conférences</h1>
          <p className={styles.heroSubtitle}>
            Des événements inspirants pour développer vos compétences
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Prochaines conférences</h2>
          {!isLoading && (
            <span className={styles.countBadge}>
              {filtered.length} conférence{filtered.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {/* Barre de filtre / recherche */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Rechercher par titre, description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher une conférence"
            />
            {search && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                type="button"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.sortWrapper}>
            <label className={styles.sortLabel} htmlFor="sort-select">
              Trier&nbsp;:
            </label>
            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Plus récentes</option>
              <option value="asc">Plus anciennes</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {isLoading && (
            <p className={styles.loading}>Chargement des conférences…</p>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className={styles.empty}>
              <p>
                {search
                  ? `Aucun résultat pour « ${search} ».`
                  : "Aucune conférence pour le moment."}
              </p>
              {search && (
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setSearch("")}
                >
                  Réinitialiser la recherche
                </button>
              )}
            </div>
          )}
          {!isLoading &&
            filtered.length > 0 &&
            paginated.map((conference) => {
              const key = conference?.id ?? conference?._id;
              return <ConferenceCard key={key} conference={conference} />;
            })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              aria-label="Page précédente"
            >
              ←
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${
                      currentPage === page ? styles.pageBtnActive : ""
                    }`}
                    onClick={() => goToPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              aria-label="Page suivante"
            >
              →
            </button>
          </nav>
        )}

        {!isLoading && filtered.length > 0 && totalPages > 1 && (
          <p className={styles.pageInfo}>
            Page {currentPage} / {totalPages} —{" "}
            {(currentPage - 1) * ITEMS_PER_PAGE + 1} à{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur{" "}
            {filtered.length} conférence{filtered.length > 1 ? "s" : ""}
          </p>
        )}
      </section>
    </>
  );
}
