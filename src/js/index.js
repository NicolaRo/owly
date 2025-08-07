// Index.js è l'entry point dell'applicazione
// Importa gli stili SCSS
import "../css/style.scss";

// Importa la funzione bookFinder da api.js
import { bookFinder } from "./api.js";

// Importa da dom.js la funzione che gestisce il render dei risultati nel DOM
import { renderResults, clearResults, showModal } from "./dom.js";

// Importa da utilis.js la funzione debounce per ottimizzare le chiamate API
import { debounce } from './utils.js';

// Variabili globali per i riferimenti agli elementi del DOM
// e per il testo originale del bottone di ricerca
let searchButton, searchInput, selectInput, originalButtonText;

// Creo la funzione per gestire la ricerca
function handleSearch() {
  // Controllo se il testo della ricerca ha il giusto numero di spazi
  const query = searchInput.value.trim();

  // Controllo se l'utente ha selezionato un tipo di ricerca
  const type = selectInput.value;

  // Se i campi non sono compilati, mostra un messaggio di errore
  if (!query || !type) {
  showModal(!query ? "Inserisci un termine di ricerca" : "Seleziona il tipo di ricerca"); // QUA CI VA UN ARIA-LABEL?
    return;
  }

  // Imposto il bottone di ricerca come disabilitato e cambio il testo per indicare che la ricerca è in corso
  searchButton.disabled = true;
  searchButton.innerHTML = `
    <span class="spinner"></span> Ricerca in corso...
  `;

  // clearResults() è una funzione che rimuove i risultati precedenti dal DOM
  // QUA CI VA UN ARIA-LABEL?
  clearResults();

  // Eseguo la ricerca chiamando la funzione bookFinder con i parametri query e type
  bookFinder(query, type)
    .then(renderResults)
    .catch((error) => {
      console.error("Search error:", error);
      showModal("Errore durante la ricerca. Riprova più tardi.");
    })
    .finally(() => {
      searchButton.disabled = false;
      searchButton.textContent = originalButtonText;
    });
}

// Event listeners - ALL DOM CODE GOES HERE
document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize DOM references
  searchButton = document.getElementById("search-button");
  searchInput = document.getElementById("search-input");
  selectInput = document.getElementById("select-input");
  originalButtonText = searchButton.textContent;

  // 2. Set accessibility attributes
  searchInput.setAttribute('aria-label', 'Barra di ricerca libri');
  selectInput.setAttribute('aria-label', 'Filtra per tipo di ricerca');
  searchButton.setAttribute('aria-label', 'Avvia ricerca');

  // 3. Set up event listeners
  searchButton.addEventListener("click", handleSearch);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Debounced input tracking
  searchInput.addEventListener('input', debounce(() => {
    const query = searchInput.value.trim();
    console.log("Query aggiornata:", query); 
  }, 500));
});