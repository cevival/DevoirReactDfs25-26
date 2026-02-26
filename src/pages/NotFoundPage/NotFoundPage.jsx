import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section>
      <h1>Page introuvable</h1>
      <p>La page demandée n’existe pas.</p>
      <Link to="/">Retour à l’accueil</Link>
    </section>
  );
}
