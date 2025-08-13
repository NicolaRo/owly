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

  // Crea il modale vero e proprio con aria attributes per migliorare l'accessibilità
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog_label"
      aria-describedby="dialog_desc">
      <h2 id="dialog_label">${isError ? "Errore" : "Messaggio"}</h2>
      <p id="dialog_desc" style="color: ${isError ? "#d32f2f" : "#388e3c"}">
      ${message}
      <button class="modal-close" id="modal-close">OK</button>
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

  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results-container";
  const savedView = sessionStorage.getItem("viewMode") || "list-view";
  resultsContainer.classList.add(savedView);

  const heroSection = document.querySelector(".hero-section");
  heroSection.insertAdjacentElement("afterend", resultsContainer);

  const togglePlaceholder = document.createElement("div");
  togglePlaceholder.className = "toggle-placeholder";

  const toggleButton = document.createElement("button");
  toggleButton.className = "toggle-button";
  toggleButton.textContent = "Cambia vista";
  toggleButton.setAttribute("aria-label", "Cambia visualizzazione lista/griglia");

  togglePlaceholder.appendChild(toggleButton);
  resultsContainer.appendChild(togglePlaceholder);

  const booksWrapper = document.createElement("div");
  booksWrapper.className = "books-wrapper";
  resultsContainer.appendChild(booksWrapper);

  toggleButton.addEventListener("click", () => {
    if (resultsContainer.classList.contains("list-view")) {
      resultsContainer.classList.remove("list-view");
      resultsContainer.classList.add("grid-view");
      sessionStorage.setItem("viewMode", "grid-view");
    } else {
      resultsContainer.classList.remove("grid-view");
      resultsContainer.classList.add("list-view");
      sessionStorage.setItem("viewMode", "list-view");
    }
  });

  // 4. Se non ci sono libri, mostra messaggio
  if (!books || books.length === 0) {
    const noResultsMsg = document.createElement("p");
    noResultsMsg.setAttribute("role", "status"); // Aria attribute  per accessibilità
    noResultsMsg.textContent = "Nessun risultato trovato";
    noResultsMsg.className = "no-results";
    noResultsMsg.setAttribute("aria-live", "polite"); // Annuncia il cambiamento
    noResultsMsg.setAttribute("aria-label", "Nessun risultato trovato");
    resultsContainer.appendChild(noResultsMsg);
    return;
  }

  // 5. Crea HTML per ogni libro con copertina
  books.forEach((book) => {
    console.log("Book details:", book); // Mostra a console i dettagli del libro per debugging

    const coverUrl = bookCover(book.cover_i);

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";
    
    
    // Imposta la classe css per gestire layout copertina libro
    bookDiv.style.setProperty('--book-cover-url', `url(${coverUrl})`);

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
              data-title="${book.title ? book.title.replace(/"/g, '&quot;') : 'Titolo non disponibile'}"
              data-bookYear="${book.first_publish_year}"
              data-cover="${book.cover_i}" 
              data-author="${Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Autore non disponibile'}">
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
              }<strong>Anno:</strong> ${
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

        const bookDetailsButtons = document.querySelectorAll(".book-details");
        
        bookDetailsButtons.forEach((button) => {
          // Imposta aria-label direttamente su ogni bottone
          const title = button.getAttribute("data-title") || "Titolo non disponibile";
          // Aria label per ottenere il titolo di ciascun libro 
          button.setAttribute("aria-label", `Ottieni i dettagli del libro ${title}`);
        
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
            bookDescription.setAttribute("role", "dialog");
            bookDescription.setAttribute("aria-modal", "true");
            bookDescription.setAttribute("aria-labelledby", "bookTitle");
        
            // Bottone di chiusura con aria-label
            const closeButton = document.createElement("button");
            closeButton.className = "close-button";
            closeButton.textContent = "Chiudi";
            closeButton.setAttribute("aria-label", "Chiudi dettagli libro");
            closeButton.addEventListener("click", () => {
              bookDescription.remove();
            });
        
            resultsContainer.appendChild(bookDescription);
        
            getBookDetails(bookKey)
              .then((details) => {
                bookDescription.innerHTML = `
                  <h4 id="bookTitle">${details.title || "Titolo non disponibile"}</h4>
                  <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
                  <p><strong>Autore:</strong> ${
                    button.getAttribute("data-author") || "Autori non disponibili"
                  }</p> 
                  <p><strong>Anno:</strong> ${
                    button.getAttribute("data-bookYear") || "Anno non disponibile"
                  }</p>
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