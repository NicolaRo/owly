// dom.js - Gestisce la manipolazione del DOM

//Importo le funzioni principali create in api.js

import { getBookDetails, bookCover } from "./api.js";

// Funzione per pulire i risultati precedenti
export function clearResults() {
  const existingResults = document.querySelector(".results-container");
  if (existingResults) {
    existingResults.remove();
  }
}

// Attivazione modale in caso di errori
// Variabile per tenere traccia del modale attivo
let activeModal = null;

export function showModal(message, isError = true) {
  // Se non esiste nessun messaggio d'errore da mostrare chiude il modale
  if (activeModal) closeModal();

  // Crea il modale vero e proprio
  // QUA CI VA UN ARIA-LABEL?
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <p style="color: ${isError ? "#d32f2f" : "#388e3c"}">${message}</p>
      <button class="modal-close">OK</button>
    </div>
  `;

  document.body.appendChild(modal); // Appende il modale al body
  activeModal = modal;

  // Chiude il modale al click del bottone "OK"
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
}
// Funzione per chiudere il modale se esiste
function closeModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

// Funzione per renderizzare i risultati
export function renderResults(books) {
  console.log("Dom.js riceve questi libri:", books); // Mostra a console il messaggio per debugging

  // 1. Pulisci risultati precedenti
  clearResults();

  // 2. Crea un container per i risultati (perché non esiste nell'HTML)
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results-container list-view"; // Imposta la classe per la visualizzazione predefinita

  // 3. Inserisci il container nella pagina (dopo la hero-section)
  const heroSection = document.querySelector(".hero-section");
  heroSection.insertAdjacentElement("afterend", resultsContainer);

  // 4. Crea il wrapper per il toggle che cambia la visualizzazione dei risultati
  const togglePlaceholder = document.createElement("div");
  togglePlaceholder.className = "toggle-placeholder";

  const toggleButton = document.createElement("button"); // creazione del toggle (button) vero e proprio // QUA CI VA UN ARIA-LABEL?
  toggleButton.className = "toggle-button";

  toggleButton.textContent = "Cambia vista";

  togglePlaceholder.appendChild(toggleButton);
  resultsContainer.appendChild(togglePlaceholder);

  // 5. Crea il wrapper che conterrà i book-result
  const booksWrapper = document.createElement("div"); // QUA CI VA UN ARIA-LABEL?
  booksWrapper.className = "books-wrapper";
  resultsContainer.appendChild(booksWrapper);

  // 6. Aggiungi l'event listener al bottone per cambiare la visualizzazione
  toggleButton.addEventListener("click", () => {
    // 6.1 Cambia la classe del container per alternare tra list-view e grid-view
    if (resultsContainer.classList.contains("list-view")) {
      resultsContainer.classList.remove("list-view");
      resultsContainer.classList.add("grid-view");
    } else {
      resultsContainer.classList.remove("grid-view");
      resultsContainer.classList.add("list-view");
    }
  });

  // 4. Se non ci sono libri, mostra messaggio
  if (!books || books.length === 0) {
    const noResultsMsg = document.createElement("p"); // QUA CI VA UN ARIA-LABEL?
    noResultsMsg.textContent = "Nessun risultato trovato";
    resultsContainer.appendChild(noResultsMsg);
    return;
  }

  // 5. Crea HTML per ogni libro con copertina
  books.forEach((book) => {
    console.log("Book details:", book); // Mostra a console i dettagli del libro per debugging

    const coverUrl = bookCover(book.cover_i); // QUA CI VA UN ARIA-LABEL?

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";
    // Lista autori sempre come array
    const authors = Array.isArray(book.author_name) ? book.author_name : [];
    const authorsPreview = authors.slice(0, 2).join(", ");
    const hasMoreAuthors = authors.length > 2;
    bookDiv.innerHTML = `
        <h3>${book.title || "Titolo non disponibile"}</h3>
        <div class="book-content">
          <div class="book-left">
            <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
            <button 
              class="book-details" 
                value="${book.key}"
                data-bookYear="${book.first_publish_year}"
                data-cover="${book.cover_i}" 
                data-author="${book.author_name}">
              Dettagli Libro
            </button>
          </div>
          <div class="book-right">
            <p><strong>Autore:</strong> 
              ${
                authors.length === 0 ? "Autore non disponibile" : authorsPreview
              }
              ${
                hasMoreAuthors
                  ? `<button class="show-more-authors" type="button">...</button>`
                  : ""
              }
            </p>
            <p><strong>Anno:</strong> ${
              book.first_publish_year || "Anno non disponibile"
            }</p>
          </div>
        </div>
      `;

    booksWrapper.appendChild(bookDiv);
    if (hasMoreAuthors) {
      const moreBtn = bookDiv.querySelector(".show-more-authors");
      moreBtn.addEventListener("click", () => {
        bookDiv.querySelector(".book-details")?.click();
      });
    }
  });

  // 6. Aggiungi un event listener per il bottone "Dettagli libro"
  const bookDetailsButtons = document.querySelectorAll(".book-details"); // QUA CI VA UN ARIA-LABEL?
  bookDetailsButtons.forEach((button) => {
    console.log("Button value", button.value); // Mostra a console il bottone per debugging
    button.addEventListener("click", () => {
      // 6.1 Rimuove eventuale modale già presente
      const existingModal = document.querySelector(".book-description");
      if (existingModal) {
        existingModal.remove();
      }

      const bookKey = button.value;
      /* const bookInfo = JSON.parse(button.getAttribute("data-bookInfo")); // Ottiene le informazioni del libro dal data attribute */
      const coverId = button.getAttribute("data-cover");
      const coverUrl = bookCover(coverId);

      // 6.2 Crea il div per la descrizione del libro (modale)
      const bookDescription = document.createElement("div"); // QUA CI VA UN ARIA-LABEL?
      bookDescription.className = "book-description";

      // 6.3 Aggiungi un bottone di chiusura del modale
      const closeButton = document.createElement("button"); // QUA CI VA UN ARIA-LABEL?
      closeButton.className = "close-button";
      closeButton.textContent = "Chiudi";
      closeButton.addEventListener("click", () => {
        bookDescription.remove();
      });

      // 6.4 Appendo subito il div (per renderlo riutilizzabile anche nel "catch")
      resultsContainer.appendChild(bookDescription);

      // 7 Recupera i dettagli del libro
      getBookDetails(bookKey)
        .then((details) => {
          console.log("button:", button.getAttribute("data-bookYear")); // Mostra a console l'anno per debugging
          bookDescription.innerHTML = `
            <h4>${details.title || "Titolo non disponibile"}</h4>
            <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
            <p><strong>Autore:</strong> ${
              button.getAttribute("data-author")
                ? button.getAttribute("data-author")
                : "Autori non disponibili"
            }</p> 
            <p><strong>Anno:</strong> ${
              button.getAttribute("data-bookYear")
                ? button.getAttribute("data-bookYear")
                : "Anno non disponibile"
            }</p>
            <p><strong>Descrizione:</strong> ${
              details.description || "Nessuna descrizione disponibile."
            }</p>
          `;
        })

        // 8 Funzione catch per gestire gli errori
        .catch((error) => {
          console.error("Errore nel recupero dei dettagli del libro:", error); // Mostra l'errore a console per debugging
          bookDescription.innerHTML =
            "<p>Errore nel caricamento dei dettagli del libro.</p>";
        })
        // 8.1. se non ci sono errori crea il modale con il bottone di chiusura
        .finally(() => {
          bookDescription.appendChild(closeButton);
        });
    });
  });
}
