// index.js — entry point
// Importa le dipendenze e il CSS
import "../css/style.scss";
import { bookFinder } from "./api.js";
import { renderResults, clearResults, showModal } from "./dom.js";
import { debounce } from "./utils.js";

// Importo la funzione debugLog per mostrare a console i messaggi di debug
import { debugLog } from "./utils.js";

// Importa le immagini necessarie
import owlyLogo from "../img/Owly-Logo.png";
import githubLogo from "../img/social-icon/Github-Logo-Black.png";
import favicon32 from "../img/social-icon/favicon-32x32.png";



document.addEventListener("DOMContentLoaded", () => {
  
  //  aggiorna dinamicamente gli src per consentire a webpack il caricamento delle immagini
  document.querySelector(".owly-Logo").src = owlyLogo;
  document.querySelector("img[alt='Nicola Rossi DevPortfolio']").src = favicon32;
  document.querySelector("img[alt='Nicola Rossi GitHub profile']").src = githubLogo;

  // riferimenti DOM (scoped, non globali)
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const selectInput = document.getElementById("select-input");

  // salva stato originale (HTML e aria-label) *subito*
  const originalButtonHTML = searchButton.innerHTML;
  const originalButtonAriaLabel = searchButton.getAttribute("aria-label") || "Cerca libri";

  // setup accessibilità: metti solo gli stati iniziali (non stati temporanei come "loading")
  function setupAccessibility() {
    if (!searchInput.getAttribute("aria-label")) {
      searchInput.setAttribute("aria-label", "Barra di ricerca libri");
    }
    if (!selectInput.getAttribute("aria-label")) {
      selectInput.setAttribute("aria-label", "Filtra per tipo di ricerca");
    }
    if (!searchButton.getAttribute("aria-label")) {
      searchButton.setAttribute("aria-label", originalButtonAriaLabel);
    }
  }
  setupAccessibility();

  // imposta pulsante in stato loading (usalo sempre al posto di duplicare il codice)
  function setButtonLoadingState() {
    searchButton.disabled = true;
    // mantenere aria-hidden sullo spinner, e aggiornare aria-busy/aria-label
    searchButton.innerHTML = `<span class="spinner" aria-hidden="true"></span> Ricerca in corso...`;
    searchButton.setAttribute("aria-busy", "true");
    searchButton.setAttribute("aria-label", "Ricerca in corso, attendere");
  }

  // ripristina lo stato normale
  function setButtonNormalState() {
    searchButton.disabled = false;
    searchButton.innerHTML = originalButtonHTML;
    searchButton.removeAttribute("aria-busy");
    searchButton.setAttribute("aria-label", originalButtonAriaLabel);
  }

    // funzione di ricerca (usa async/await per chiarezza)
    async function handleSearch() {
      const query = searchInput.value.trim();
      const type = selectInput.value;

      if (!query || !type) {
        showModal(!query ? "Inserisci un termine di ricerca" : "Seleziona il tipo di ricerca");
        return;
      }

    setButtonLoadingState();
    clearResults();

    try {
      const results = await bookFinder(query, type);
      renderResults(results);
    } catch (error) {
      console.error("Search error:", error);
      showModal("Errore durante la ricerca. Riprova più tardi.");
    } finally {
      setButtonNormalState();
    }
  }

  // listeners
  searchButton.addEventListener("click", handleSearch);

  // keypress è deprecato per alcuni casi: usare keydown ed evitare comportamenti predefiniti
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  searchInput.addEventListener(
    "input",
    debounce(() => {
      debugLog("Query aggiornata:", searchInput.value.trim());
    }, 500)
  );
});
