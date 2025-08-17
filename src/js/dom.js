// dom.js - Gestisce la manipolazione del DOM

import { debugLog } from "./utils.js";
import { getBookDetails, bookCover } from "./api.js";

// ------------------------ SOCIAL ICONS ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const socialContainer = document.querySelector(".Social-container");
  if (socialContainer) {
    socialContainer.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) {
        event.preventDefault();
        const url = link.getAttribute("href");
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });
  }
});

// ------------------------ UTILITY ------------------------
export function clearResults() {
  const existingResults = document.querySelector(".results-container");
  if (existingResults) existingResults.remove();
}

let activeModal = null;
let allResults = [];
let displayedCount = 10;

// ------------------------ MODALE ------------------------
export function showModal(message, isError = true) {
  if (activeModal) closeModal();

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog_label"
      aria-describedby="dialog_desc">
      <h2 id="dialog_label">${isError ? "Errore" : "Messaggio"}</h2>
      <p id="dialog_desc" style="color: ${
        isError ? "#d32f2f" : "#388e3c"
      }">${message}</p>
      <button class="modal-close" id="modal-close">OK</button>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.focus();
  closeBtn.addEventListener("click", closeModal);
}

function closeModal() {
  if (activeModal) {
    const lastFocus = activeModal.lastFocus;
    activeModal.remove();
    activeModal = null;
    if (lastFocus) lastFocus.focus();
  }
}

// ------------------------ RENDER BOOKS ------------------------
export function renderResults(books) {
  debugLog("Dom.js riceve questi libri:", books);
  clearResults();

  const resultsContainer = document.createElement("div");
  resultsContainer.className = "results-container";
  const savedView = sessionStorage.getItem("viewMode") || "list-view";
  resultsContainer.classList.add(savedView);

  const heroSection = document.querySelector(".hero-section");
  heroSection.insertAdjacentElement("afterend", resultsContainer);

  // Toggle vista
  const togglePlaceholder = document.createElement("div");
  togglePlaceholder.className = "toggle-placeholder";

  const toggleButton = document.createElement("button");
  toggleButton.className = "toggle-button";
  toggleButton.textContent = "Cambia vista";
  toggleButton.setAttribute(
    "aria-label",
    "Cambia visualizzazione lista/griglia"
  );
  toggleButton.setAttribute("aria-pressed", savedView === "grid-view");

  togglePlaceholder.appendChild(toggleButton);
  resultsContainer.appendChild(togglePlaceholder);

  toggleButton.addEventListener("click", () => {
    if (resultsContainer.classList.contains("list-view")) {
      resultsContainer.classList.replace("list-view", "grid-view");
      toggleButton.setAttribute("aria-pressed", "true");
      sessionStorage.setItem("viewMode", "grid-view");
    } else {
      resultsContainer.classList.replace("grid-view", "list-view");
      toggleButton.setAttribute("aria-pressed", "false");
      sessionStorage.setItem("viewMode", "list-view");
    }
  });

  // Contenitore libri
  const booksWrapper = document.createElement("div");
  booksWrapper.className = "books-wrapper";
  resultsContainer.appendChild(booksWrapper);

  if (!books || books.length === 0) {
    const noResultsMsg = document.createElement("p");
    noResultsMsg.setAttribute("role", "status");
    noResultsMsg.setAttribute("aria-live", "polite");
    noResultsMsg.setAttribute("aria-label", "Nessun risultato trovato");
    noResultsMsg.className = "no-results";
    noResultsMsg.textContent = "Nessun risultato trovato";
    resultsContainer.appendChild(noResultsMsg);
    return;
  }

  // Render libri
  books.forEach((book) => {
    const coverUrl = bookCover(book.cover_i);
    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";
    bookDiv.style.setProperty("--book-cover-url", `url(${coverUrl})`);

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
  data-title="${
    book.title ? book.title.replace(/"/g, "&quot;") : "Titolo non disponibile"
  }"
  data-bookYear="${book.first_publish_year}"
  data-cover="${book.cover_i}" 
  data-author="${
    Array.isArray(book.author_name)
      ? book.author_name.join(", ")
      : "Autore non disponibile"
  }"
  aria-label="Mostra dettagli del libro ${
    book.title ? book.title : "Titolo non disponibile"
  }">
  Dettagli Libro
</button>
        </div>
        <div class="book-right">
          <p><strong>Autore:</strong> 
            ${authors.length === 0 ? "Autore non disponibile" : authorsPreview}
            ${
              hasMoreAuthors
                ? `<button class="show-more-authors" type="button">...</button>`
                : ""
            }
            <strong>Anno:</strong> ${
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

  // ------------------------ EVENT DELEGATION PER BOOK DETAILS ------------------------
  booksWrapper.addEventListener("click", (event) => {
    const button = event.target.closest(".book-details");
    if (!button) return;

    const bookKey = button.value;
    const coverId = button.getAttribute("data-cover");
    const coverUrl = bookCover(coverId);

    const existingModal = document.querySelector(".book-description");
    if (existingModal) existingModal.remove();

    const bookDescription = document.createElement("div");
    bookDescription.className = "book-description";
    bookDescription.setAttribute("role", "dialog");
    bookDescription.setAttribute("aria-modal", "true");
    bookDescription.setAttribute("aria-labelledby", "bookTitle");

    // Focus trap minimo: salva il pulsante che ha aperto il modale
    bookDescription.lastFocus = button;

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Chiudi";
    closeButton.setAttribute("aria-label", "Chiudi dettagli libro");
    closeButton.addEventListener("click", () => bookDescription.remove());

    resultsContainer.appendChild(bookDescription);
    closeButton.focus();

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
}
