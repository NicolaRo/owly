// dom.js - Gestisce solo la manipolazione del DOM

//Importo le funzioni nnecessarie

import { getBookDetails, bookCover } from "./api.js";

// Funzione per pulire i risultati precedenti
export function clearResults() {
  const existingResults = document.querySelector(".results-container");
  if (existingResults) {
    existingResults.remove();
  }
}
// Funzione per renderizzare i risultati
export function renderResults(books) {
  console.log("Dom.js riceve questi libri:", books);

  // 1. Pulisci risultati precedenti
  clearResults();

  // 2. Crea un container per i risultati (perché non esiste nell'HTML)
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results-container";

  // 3. Inserisci il container nella pagina (dopo la hero-section)
  const heroSection = document.querySelector(".hero-section");
  heroSection.insertAdjacentElement("afterend", resultsContainer);

  // 4. Se non ci sono libri, mostra messaggio
  if (!books || books.length === 0) {
    resultsContainer.innerHTML = "<p>Nessun risultato trovato</p>";
    return;
  }

  // 5. Crea HTML per ogni libro con copertina
  books.forEach((book, index) => {
    const coverId = book.cover_i;
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "img/placeholder.jpg";

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";
    bookDiv.innerHTML =
      // Inserisci i dati del libro nell'HTML
      ` 
      <h3>${book.title || "Titolo non disponibile"}</h3>

      <img src="${coverUrl}" 
        alt="Copertina del libro" 
        class="book-cover"
      >
      <p><strong>Autore:</strong> ${
        book.author_name
          ? book.author_name.join(", ")
          : "Autore non disponibile"
      }</p>
      <p><strong>Anno:</strong> ${
        book.first_publish_year || "Anno non disponibile"
      }</p>
      <button 
        class="book-details" 
        value="${book.key}"
        data-cover="${coverId}" 
        >
        Dettagli Libro
      </button> 
    `;
    resultsContainer.appendChild(bookDiv);
  });

  // 7. Aggiungi un event listener per i bottoni dei dettagli
const bookDetailsButtons = document.querySelectorAll(".book-details");
bookDetailsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Rimuove eventuale modale già presente
    const existingModal = document.querySelector(".book-description");
    if (existingModal) {
      existingModal.remove();
    }

    const bookKey = button.value;
    const coverId = button.getAttribute("data-cover");
    const coverUrl = bookCover(coverId);

    // Crea il div per la descrizione (modale)
    const bookDescription = document.createElement("div");
    bookDescription.className = "book-description";

    // Aggiungi un bottone di chiusura
    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Chiudi";
    closeButton.addEventListener("click", () => {
      bookDescription.remove();
    });

    // Appendo subito il div (così anche nel catch lo posso usare)
    resultsContainer.appendChild(bookDescription);

    // Recupera i dettagli
    getBookDetails(bookKey)
      .then((details) => {
        bookDescription.innerHTML = `
          <h4>${details.title}</h4>
          <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
          <p><strong>Autore:</strong> ${details.author_name.join(", ")}</p>
          <p><strong>Anno:</strong> ${details.first_publish_year}</p>
          <p><strong>Descrizione:</strong> ${
            details.description || "Nessuna descrizione disponibile."
          }</p>
        `;
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dettagli del libro:", error);
        bookDescription.innerHTML =
          "<p>Errore nel caricamento dei dettagli del libro.</p>";
      })
      .finally(() => {
        bookDescription.appendChild(closeButton);
      });
    });
})};