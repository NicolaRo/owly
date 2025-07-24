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