import axios from "axios";
import placeholderImage from "../img/book-cover-placeholder.jpg"; 
import { debugLog } from "./utils.js";
import { showModal } from "./dom.js";

const baseUrl = process.env.API_BASE_URL || "https://openlibrary.org";

export function bookFinder(query, type) {
  const fullUrl = `${baseUrl}/search.json?${type}=${encodeURIComponent(query)}`; 
  debugLog("URL richiesta:", fullUrl); 

  if (!type) {
    // Mostro il modale e imposto aria attributes
    showModal("Seleziona il tipo di ricerca.");
    const modal = document.querySelector(".modal"); // o il selettore giusto del tuo modal
    if (modal) {
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
    }
    return;
  }

  return axios
    .get(fullUrl) 
    .then((response) => {
      const allResults = response.data.docs;
      debugLog("tutti i risultati", allResults);
      return allResults; 
    })
    .catch((error) => {
      debugLog("Errore bookFinder:", error);
      throw error;
    });
}

export function getBookDetails(bookKey) {
  debugLog("Verifica bookKey", bookKey);

  if (!bookKey) return Promise.reject("bookKey non valida");

  const fullUrl = `${baseUrl}${bookKey}.json`;
  debugLog("URL dettagli libro:", fullUrl); 

  return axios.get(fullUrl)
    .then((response) => {
      const details = response.data;

      // Normalizzo autori
      if (!details.author_name && details.authors) {
        details.author_name = ["Autore"];
      }

      // Normalizzo descrizione
      if (details.description && typeof details.description === 'object' && details.description.value) { 
        details.description = details.description.value;
      }

      return details;
    })
    .catch((error) => {
      debugLog("Errore getBookDetails:", error);
      throw error;
    });
}

export function bookCover(coverId) {
  if (!coverId || coverId === "null" || coverId === "undefined") { 
    return placeholderImage;
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}
