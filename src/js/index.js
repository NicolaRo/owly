// Importa gli stili SCSS
import "../css/style.scss";

// Importa le funzioni 
import { bookFinder } from "./api.js";
import { renderResults, clearResults } from "./dom.js";

// DOM References (declare once at top level)
let searchButton, searchInput, selectInput, originalButtonText;

// Funzione per gestire la ricerca
function handleSearch() {
  const query = searchInput.value.trim();
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
  searchButton = document.getElementById("search-button");
  searchInput = document.getElementById("search-input");
  selectInput = document.getElementById("select-input");
  originalButtonText = searchButton.textContent;

  // Set up event listeners
  searchButton.addEventListener("click", handleSearch);
  
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
});