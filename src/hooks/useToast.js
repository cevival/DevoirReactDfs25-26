import { useToastContext } from "../context/ToastContext";

/**
 * useToast — hook pour afficher des notifications pop-up.
 *
 * @example
 * const { toast } = useToast();
 * toast.success("Conférence créée !");
 * toast.error("Une erreur est survenue.");
 * toast.info("Chargement en cours...");
 */
export function useToast() {
  const { addToast } = useToastContext();

  const toast = {
    success: (message) => addToast(message, "success"),
    error: (message) => addToast(message, "error"),
    info: (message) => addToast(message, "info"),
  };

  return { toast };
}
