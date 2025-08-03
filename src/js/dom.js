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
  resultsContainer.className = "results-container list-view";

  // 3. Inserisci il container nella pagina (dopo la hero-section)
  const heroSection = document.querySelector(".hero-section");
  heroSection.insertAdjacentElement("afterend", resultsContainer);

  // 3.1 Crea il toggleButton per cambiare la visualizzazione dei risultati
  const toggleButton = document.createElement("button");
  toggleButton.className = "toggle-button";
  toggleButton.textContent = "Cambia vista";
  toggleButton.addEventListener("click", () => { //Event listener sul bottone
    if (resultsContainer.classList.contains("list-view")) {
      resultsContainer.classList.remove("list-view"); // aggiunge o rimuove una classe css a seconda della scelta dell'utente
      resultsContainer.classList.add("grid-view");
    } else {
      resultsContainer.classList.remove("grid-view");
      resultsContainer.classList.add("list-view");
    }
  });

  // 4. Se non ci sono libri, mostra messaggio
  if (!books || books.length === 0) {
    resultsContainer.innerHTML = "<p>Nessun risultato trovato</p>";
    return;
  }

  // 5. Inserisco il toggle prima dei risultati
  resultsContainer.appendChild(toggleButton);

  // 5. Crea HTML per ogni libro con copertina
  books.forEach((book, index) => {
    const coverId = book.cover_i;
    const coverUrl = bookCover(coverId);

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

  // 7. Aggiungi un event listener per il bottone "Dettagli libro"
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

      // Crea il div per la descrizione del libro (modale)
      const bookDescription = document.createElement("div");
      bookDescription.className = "book-description";

      // Aggiungi un bottone di chiusura del modale
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
  });
}
