// dom.js - Gestisce la manipolazione del DOM con accorgimenti UX avanzati

import { debugLog } from "./utils.js";
import { getBookDetails, bookCover } from "./api.js";

// ---------- Eventi social (event delegation) ----------
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

// ---------- Funzioni generiche ----------
export function clearResults() {
  const existingResults = document.querySelector(".results-container");
  if (existingResults) existingResults.remove();
}

// Modale errori/messaggi
let activeModal = null;

export function showModal(message, isError = true) {
  if (activeModal) closeModal();

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

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

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
  activeModal = modal;

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
}

function closeModal() {
  if (activeModal) {
    document.querySelector(".modal-backdrop")?.remove();
    activeModal.remove();
    activeModal = null;
  }
}

// ---------- Rendering risultati ----------
let allResults = [];
let displayedCount = 10;

export function renderResults(books) {
  debugLog("Dom.js riceve questi libri:", books);
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
      resultsContainer.classList.replace("list-view", "grid-view");
      sessionStorage.setItem("viewMode", "grid-view");
    } else {
      resultsContainer.classList.replace("grid-view", "list-view");
      sessionStorage.setItem("viewMode", "list-view");
    }
  });

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

  books.forEach((book) => {
    const coverUrl = bookCover(book.cover_i);

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";
    bookDiv.style.setProperty('--book-cover-url', `url(${coverUrl})`);

    const authors = Array.isArray(book.author_name) ? book.author_name : [];
    const authorsPreview = authors.slice(0, 2).join(", ");
    const hasMoreAuthors = authors.length > 2;

    bookDiv.innerHTML = `
      <div class="book-cover-container">
        <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
        <div class="book-overlay">
          <h3>${book.title || "Titolo non disponibile"}</h3>
          <div class="book-buttons">
            <button class="book-details"
              value="${book.key}"
              data-title="${book.title ? book.title.replace(/"/g, '&quot;') : 'Titolo non disponibile'}"
              data-bookYear="${book.first_publish_year}"
              data-cover="${book.cover_i}"
              data-author="${Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Autore non disponibile'}"
              aria-label="Ottieni i dettagli del libro ${book.title || 'Titolo non disponibile'}">
              Dettagli
            </button>
            <button class="like-button" aria-label="Aggiungi ai preferiti">❤️</button>
          </div>
        </div>
      </div>
      <p class="book-meta">
        <strong>Autore:</strong> ${authorsPreview || "Autore non disponibile"} 
        ${hasMoreAuthors ? `<button class="show-more-authors" type="button">...</button>` : ""}
        <strong>Anno:</strong> ${book.first_publish_year || "Anno non disponibile"}
      </p>
    `;

    booksWrapper.appendChild(bookDiv);

    if (hasMoreAuthors) {
      bookDiv.querySelector(".show-more-authors").addEventListener("click", () => {
        bookDiv.querySelector(".book-details")?.click();
      });
    }

    // ---------- Pulsante "Mi Piace" ----------
    const likeButton = bookDiv.querySelector(".like-button");
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(book.key)) likeButton.classList.add("liked");

    likeButton.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favorites.includes(book.key)) {
        favorites = favorites.filter(k => k !== book.key);
        likeButton.classList.remove("liked");
      } else {
        favorites.push(book.key);
        likeButton.classList.add("liked");
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  });

  // ---------- Dettagli libro (modale) ----------
  booksWrapper.addEventListener("click", (event) => {
    const button = event.target.closest(".book-details");
    if (!button) return;

    const existingModal = document.querySelector(".book-description");
    if (existingModal) existingModal.remove();

    const bookKey = button.value;
    const coverId = button.getAttribute("data-cover");
    const coverUrl = bookCover(coverId);

    const bookDescription = document.createElement("div");
    bookDescription.className = "book-description";
    bookDescription.setAttribute("role", "dialog");
    bookDescription.setAttribute("aria-modal", "true");
    bookDescription.setAttribute("aria-labelledby", "bookTitle");

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Chiudi";
    closeButton.setAttribute("aria-label", "Chiudi dettagli libro");
    closeButton.addEventListener("click", () => bookDescription.remove());

    resultsContainer.appendChild(bookDescription);

    getBookDetails(bookKey)
      .then((details) => {
        bookDescription.innerHTML = `
          <h4 id="bookTitle">${details.title || "Titolo non disponibile"}</h4>
          <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
          <p><strong>Autore:</strong> ${button.getAttribute("data-author")}</p>
          <p><strong>Anno:</strong> ${button.getAttribute("data-bookYear")}</p>
          <p><strong>Descrizione:</strong> ${details.description || "Nessuna descrizione disponibile."}</p>
        `;
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dettagli del libro:", error);
        bookDescription.innerHTML = "<p>Errore nel caricamento dei dettagli del libro.</p>";
      })
      .finally(() => bookDescription.appendChild(closeButton));
  });
}
