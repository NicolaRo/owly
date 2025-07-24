// Importa gli stili SCSS - webpack li gestirà automaticamente
import "../css/style.scss";

// Importa le funzioni necessarie
import { bookFinder } from "./api.js";
import { renderResults, clearResults } from "./dom.js";

// Event listeners e logica principale
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const selectInput = document.getElementById("select-input");

  // Event listener per il pulsante di ricerca
  searchButton.addEventListener("click", handleSearch);

  // Event listener per Enter nell'input
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  // Funzione per gestire la ricerca
  function handleSearch() {
    const query = searchInput.value.trim();
    const type = selectInput.value;

    if (!query) {
      alert("Inserisci un termine di ricerca");
      return;
    }

    if (!type) {
      alert("Seleziona il tipo di ricerca");
      return;
    }

    // Pulisci i risultati precedenti
    clearResults();

    // Mostra loading (opzionale)
    console.log("Ricerca in corso...");

    // Esegui la ricerca
    bookFinder(query, type)
      .then((results) => {
        console.log("Risultati ottenuti:", results);
        renderResults(results);
      })
      .catch((error) => {
        console.error("Errore nella ricerca:", error);
        alert("Errore durante la ricerca. Riprova.");
      });
  }
});

// Test iniziale (puoi rimuoverlo dopo)
/* 
const testQuery = "harry potter";
const testType = "title";

bookFinder(testQuery, testType)
  .then(results => {
    console.log("Risultati dalla ricerca:", results);
  })
  .catch(error => {
    console.error("Errore nella ricerca:", error);
  });
*/
