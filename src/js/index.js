// Importa gli stili SCSS
import "../css/style.scss";

// Importa le funzioni 
import { bookFinder, getBookDetails } from "./api.js"; // Chiamate API dal file api.js
import { renderResults, clearResults } from "./dom.js"; // Risultati ottenuti e visualizzazione da dom.js

// Event listeners e logica principale
document.addEventListener("DOMContentLoaded", function () { // Imposto eventListener su:

  const searchButton = document.getElementById("search-button"); // Bottone "cerca"

  const searchInput = document.getElementById("search-input"); // Casella di input

  const selectInput = document.getElementById("select-input"); // Tasto select
  
  searchButton.addEventListener("click", handleSearch); // Pulsante di ricerca

  searchInput.addEventListener("keypress", function (e) { // Avvio la ricerca anche premendo "Invio" da tastiera
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  // Funzione per gestire la ricerca
  function handleSearch() {
    const query = searchInput.value.trim(); // Elimina spazi erronei nel campo ricerca
    const type = selectInput.value;
// Imposto alert nel caso di input non validi
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


    // Eseguo la ricerca
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
