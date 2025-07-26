// dom.js - Gestisce solo la manipolazione del DOM

//Importo le funzioni nnecessarie

import { getBookDetails } from "./api.js";

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

  // 5. Crea HTML per ogni libro
  books.forEach((book, index) => {
    // Crea un div per ogni libro
    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";

    // Inserisci i dati del libro nell'HTML
    bookDiv.innerHTML = `
      <h3>${book.title || "Titolo non disponibile"}</h3>
      <p><strong>Autore:</strong> ${
        book.author_name
          ? book.author_name.join(", ")
          : "Autore non disponibile"
      }</p>
      <p><strong>Anno:</strong> ${
        book.first_publish_year || "Anno non disponibile"
      }</p>
      <button class="book-details" value="${book.key}" >Dettagli Libro</button> 
    `;

    // Aggiungi questo libro al container
    resultsContainer.appendChild(bookDiv);
  });

  const bookDetails = document.getElementsByClassName("book-details");

// Convertiamo la HTMLCollection in un array vero
Array.from(bookDetails).forEach((button) => {
  button.addEventListener('click', () => {
    const bookKey = button.value; // assicurati che "value" sia definito
    getBookDetails(bookKey);
  });
});


  // 6. Crea un div per la descrizione del libro
  const bookDescription = document.createElement("div");
  bookDescription.className = "book-description";
  bookDescription.innerHTML = "<p>Seleziona un libro per vedere i dettagli</p>";
  resultsContainer.appendChild(bookDescription);
  // 7. Aggiungi un event listener per i bottoni dei dettagli
  const bookDetailsButtons = document.querySelectorAll(".book-details");
  bookDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bookKey = button.value; // Assicurati che "value" sia definito
      getBookDetails(bookKey)
        .then((details) => {
          // Mostra i dettagli del libro nella descrizione
          bookDescription.innerHTML = `
            <h4>${details.title}</h4>
            <p><strong>Autore:</strong> ${details.author_name.join(", ")}</p>
            <p><strong>Anno:</strong> ${details.first_publish_year}</p>
            <p><strong>Descrizione:</strong> ${details.description || "Nessuna descrizione disponibile."}</p>
          `;
        })
        .catch((error) => {
          console.error("Errore nel recupero dei dettagli del libro:", error);
          bookDescription.innerHTML = "<p>Errore nel caricamento dei dettagli del libro.</p>";
        });
    });
  });

}
