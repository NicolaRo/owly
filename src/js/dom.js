// dom.js - Gestisce la manipolazione del DOM

import { debugLog } from "./utils.js";
import { getBookDetails, bookCover } from "./api.js";

// ---------- Event Delegation Centralizzato ----------
class EventDelegator {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Event delegation per tutti i click del documento
    document.addEventListener("click", this.handleDocumentClick.bind(this));
    
    // Event delegation per il DOMContentLoaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", this.handleDOMReady.bind(this));
    } else {
      this.handleDOMReady();
    }
  }

  handleDocumentClick(event) {
    // Gestione link social
    const socialLink = event.target.closest(".Social-container a");
    if (socialLink) {
      this.handleSocialLink(event, socialLink);
      return;
    }

    // Gestione dettagli libro
    const bookDetailsBtn = event.target.closest(".book-details");
    if (bookDetailsBtn) {
      this.handleBookDetails(event, bookDetailsBtn);
      return;
    }

    // Gestione like button
    const likeBtn = event.target.closest(".like-button");
    if (likeBtn) {
      this.handleLikeButton(event, likeBtn);
      return;
    }

    // Gestione toggle view
    const toggleBtn = event.target.closest(".toggle-button");
    if (toggleBtn) {
      this.handleViewToggle(event, toggleBtn);
      return;
    }

    // Gestione modale
    const modalClose = event.target.closest(".modal-close, .close-button");
    if (modalClose) {
      this.handleModalClose(event);
      return;
    }

    const modalBackdrop = event.target.closest(".modal-backdrop");
    if (modalBackdrop) {
      this.handleModalClose(event);
      return;
    }

    // Gestione autori aggiuntivi
    const showMoreAuthors = event.target.closest(".show-more-authors");
    if (showMoreAuthors) {
      this.handleShowMoreAuthors(event, showMoreAuthors);
      return;
    }
  }

  handleDOMReady() {
    debugLog("DOM completamente caricato - Event Delegation attivo");
  }
//------------------------------------------------ gestione link social --------------------------------------------------------
handleSocialLink(event, link) {
  event.preventDefault();
  const url = link.getAttribute("href");
  
  // Validazione URL semplice
  if (!url) {
    console.warn("❌ URL è null/undefined");
    return;
  }
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    console.warn("❌ URL non inizia con http/https:", `"${trimmedUrl}"`);
    return;
  }
  
  // Apri il link senza controlli complessi
  window.open(trimmedUrl, "_blank", "noopener,noreferrer");
  console.log("✅ Link aperto:", trimmedUrl);
}

  handleBookDetails(event, button) {
    const existingModal = document.querySelector(".book-description");
    if (existingModal) existingModal.remove();

    const bookKey = button.value;
    const coverId = button.getAttribute("data-cover");
    const coverUrl = bookCover(coverId);

    this.createBookModal(bookKey, coverUrl, button);
  }

  handleLikeButton(event, button) {
    const bookDiv = button.closest(".book-result");
    const bookKey = bookDiv.querySelector(".book-details").value;
    
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (favorites.includes(bookKey)) {
      favorites = favorites.filter(k => k !== bookKey);
      button.classList.remove("liked");
      button.setAttribute("aria-label", "Aggiungi ai preferiti");
    } else {
      favorites.push(bookKey);
      button.classList.add("liked");
      button.setAttribute("aria-label", "Rimuovi dai preferiti");
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    
    // Feedback visivo
    button.style.transform = "scale(1.2)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
  }

  handleViewToggle(event, button) {
    const resultsContainer = button.closest(".results-container");
    
    if (resultsContainer.classList.contains("list-view")) {
      resultsContainer.classList.replace("list-view", "grid-view");
      sessionStorage.setItem("viewMode", "grid-view");
      button.setAttribute("aria-label", "Cambia a visualizzazione lista");
    } else {
      resultsContainer.classList.replace("grid-view", "list-view");
      sessionStorage.setItem("viewMode", "list-view");
      button.setAttribute("aria-label", "Cambia a visualizzazione griglia");
    }
  }

  handleModalClose(event) {
    closeModal();
    
    // Rimuovi anche modale dettagli libro
    const bookModal = document.querySelector(".book-description");
    if (bookModal) bookModal.remove();
  }

  handleShowMoreAuthors(event, button) {
    const bookDiv = button.closest(".book-result");
    const detailsBtn = bookDiv.querySelector(".book-details");
    if (detailsBtn) {
      detailsBtn.click();
    }
  }

  createBookModal(bookKey, coverUrl, button) {
    const resultsContainer = document.querySelector(".results-container");
    
    const bookDescription = document.createElement("div");
    bookDescription.className = "book-description";
    bookDescription.setAttribute("role", "dialog");
    bookDescription.setAttribute("aria-modal", "true");
    bookDescription.setAttribute("aria-labelledby", "bookTitle");

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "Chiudi";
    closeButton.setAttribute("aria-label", "Chiudi dettagli libro");

    resultsContainer.appendChild(bookDescription);

    // Aggiungi spinner di caricamento
    bookDescription.innerHTML = `
      <div class="loading-spinner">
        <p>Caricamento dettagli...</p>
      </div>
    `;

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
        bookDescription.innerHTML = `
          <div class="error-message">
            <p>❌ Errore nel caricamento dei dettagli del libro.</p>
            <p>Riprova più tardi.</p>
          </div>
        `;
      })
      .finally(() => {
        bookDescription.appendChild(closeButton);
        // Focus per accessibilità
        closeButton.focus();
      });
  }
}

// Inizializza l'event delegator
const eventDelegator = new EventDelegator();

// ---------- Funzioni di utilità (mantenute per compatibilità) ----------
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
      </p>
      <button class="modal-close" id="modal-close">OK</button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
  activeModal = modal;

  // Focus per accessibilità
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  if (activeModal) {
    document.querySelector(".modal-backdrop")?.remove();
    activeModal.remove();
    activeModal = null;
  }
}

// ---------- Rendering risultati (semplificato) ----------
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

    // Determina se il libro è nei preferiti
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isLiked = favorites.includes(book.key);

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
            <button class="like-button ${isLiked ? 'liked' : ''}" 
              aria-label="${isLiked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">❤️</button>
          </div>
        </div>
      </div>
      <p class="book-meta">
        <strong>Autore:</strong> ${authorsPreview || "Autore non disponibile"} 
        ${hasMoreAuthors ? `<button class="show-more-authors" type="button" aria-label="Mostra tutti gli autori">...</button>` : ""}
        <br><strong>Anno:</strong> ${book.first_publish_year || "Anno non disponibile"}
      </p>
    `;

    booksWrapper.appendChild(bookDiv);
  });
}