// Importa gli stili SCSS
import "../css/style.scss";
import { bookFinder } from "./api.js";
import { renderResults, clearResults, showModal } from "./dom.js";
import { debounce } from './utils.js';

// DOM References (declare at top level without initialization)
let searchButton, searchInput, selectInput, originalButtonText;

// Funzione per gestire la ricerca
function handleSearch() {
  const query = searchInput.value.trim();
  const type = selectInput.value;

  if (!query || !type) {
    showModal(!query ? "Inserisci un termine di ricerca" : "Seleziona il tipo di ricerca");
    return;
  }

  // Set loading state
  searchButton.disabled = true;
  searchButton.innerHTML = `
    <span class="spinner"></span> Ricerca in corso...
  `;

  clearResults();

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