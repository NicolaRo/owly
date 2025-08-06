// Importa gli stili SCSS
import "../css/style.scss";

// Importa le funzioni 
import { bookFinder } from "./api.js";
import { renderResults, clearResults } from "./dom.js";
import { debounce } from './utils.js'; //DEBOUNCE  IMPORTANTE REFACTOR!!!

// DOM References (declare once at top level)
let searchButton, searchInput, selectInput, originalButtonText;

// Funzione per gestire la ricerca
function handleSearch() {
  const query = searchInput.value.trim();
  // When starting search:
searchButton.setAttribute('aria-busy', 'true');

// When search completes/fails:
searchButton.removeAttribute('aria-busy');
  const type = selectInput.value;


  if (!query || !type) {
    // Temporarily keeping alert - we'll replace with modal later
    alert(!query ? "Inserisci un termine di ricerca" : "Seleziona il tipo di ricerca");
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
      alert("Errore durante la ricerca. Riprova più tardi.");
    })
    .finally(() => {
      // Reset button state
      searchButton.disabled = false;
      searchButton.textContent = originalButtonText;
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize DOM references
  searchInput.setAttribute('aria-label', 'Barra di ricerca libri'); // Aria-labels migliorano  acessibilità tramite l'uso di Screen readers
  selectInput.setAttribute('aria-label', 'Filtra per tipo di ricerca'); 
  searchButton.setAttribute('aria-label', 'Avvia ricerca'); 
  searchButton = document.getElementById("search-button");
  searchInput = document.getElementById("search-input");
  selectInput = document.getElementById("select-input");
  originalButtonText = searchButton.textContent;

  // Set up event listeners
  searchButton.addEventListener("click", handleSearch);
  
  searchInput.addEventListener('input', debounce(() => {
    if (searchInput.value.trim().length > 2) {
      handleSearch();
    }
  }, 500));
});