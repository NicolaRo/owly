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


  // 3.1 Se non ci sono libri, mostra messaggio
  if (!books || books.length === 0) {
    const noResultsMsg = document.createElement("p");
    noResultsMsg.textContent = "Nessun risultato trovato";
    resultsContainer.appendChild(noResultsMsg);
    return;
  }

  // 4 Crea il toggleButton per cambiare la visualizzazione dei risultati
  const togglePlaceholder = document.createElement("div"); // Crea il <div> in cui inserirlo per dare consistenza al layout
  togglePlaceholder.className = "toggle-placeholder"; // Assegno una classe per dare lo stile in css
  
const toggleButton = document.createElement("button"); // Creazione del bottone vero e proprio 
toggleButton.className = "toggle-button"; 
toggleButton.textContent = "Cambia vista";
toggleButton.addEventListener("click", () => { // Creazione della funzione del toggle
    if (resultsContainer.classList.contains("list-view")) {
        resultsContainer.classList.remove("list-view");
        resultsContainer.classList.add("grid-view");
    } else {
        resultsContainer.classList.remove("grid-view");
        resultsContainer.classList.add("list-view");
    }
});

togglePlaceholder.appendChild(toggleButton); // Metto il bottone dentro il wrapper
resultsContainer.appendChild(togglePlaceholder); // Metto il wrapper nel container


  // 5. Crea HTML per ogni libro con copertina
  books.forEach((book, index) => {
    const coverId = book.cover_i;
    const coverUrl = bookCover(coverId); // importo la funzione per la gestione della cover del libro da api.js

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-result";
    bookDiv.innerHTML = `
  <h3>${book.title || "Titolo non disponibile"}</h3>
  
  <div class="book-content">
    <div class="book-left">
      <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
      <button 
        class="book-details" 
        value="${book.key}"
        data-cover="${coverId}" >
        Dettagli Libro
      </button>
    </div>

    <div class="book-right">
      <p><strong>Autore:</strong> ${
        book.author_name ? book.author_name.join(", ") : "Autore non disponibile"
      }</p>
      <p><strong>Anno:</strong> ${
        book.first_publish_year || "Anno non disponibile"
      }</p>
    </div>
  </div>
`;

    resultsContainer.appendChild(bookDiv);
  });

  // 6. Aggiungi un event listener per il bottone "Dettagli libro"
  const bookDetailsButtons = document.querySelectorAll(".book-details");
  bookDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 6.1 Rimuove eventuale modale già presente
      const existingModal = document.querySelector(".book-description");
      if (existingModal) {
        existingModal.remove();
      }

      const bookKey = button.value;
      const coverId = button.getAttribute("data-cover");
      const coverUrl = bookCover(coverId);

      // 6.2 Crea il div per la descrizione del libro (modale)
      const bookDescription = document.createElement("div");
      bookDescription.className = "book-description";

      // 6.3 Aggiungi un bottone di chiusura del modale
      const closeButton = document.createElement("button");
      closeButton.className = "close-button";
      closeButton.textContent = "Chiudi";
      closeButton.addEventListener("click", () => {
        bookDescription.remove();
      });

      // 6.4 Appendo subito il div (così anche nel catch lo posso usare)
      resultsContainer.appendChild(bookDescription);

      // 7 Recupera i dettagli del libro
      getBookDetails(bookKey)
        .then((details) => {
          bookDescription.innerHTML = `
            <h4>${details.title || "Titolo non disponibile"}</h4>
            <img src="${coverUrl}" alt="Copertina del libro" class="book-cover">
            <p><strong>Autore:</strong> ${
              details.author_name && details.author_name.length > 0 // controlla che il nome dell'autore sia disponible e thruty
                ? details.author_name.join(", ") //Se thruty lo mostra a display
                : "Autore non disponibile" // Se il valore ottenuto è falsy informa che l'info non è disponibile
            }</p>
            <p><strong>Anno:</strong> ${
              details.first_publish_year || "Anno non disponibile"
            }</p>
            <p><strong>Descrizione:</strong> ${
              details.description || "Nessuna descrizione disponibile."
            }</p>
          `;
        })
        
        // 8 Funzione catch per gestire gli errori
        .catch((error) => { 
          console.error("Errore nel recupero dei dettagli del libro:", error); 
          bookDescription.innerHTML =
            "<p>Errore nel caricamento dei dettagli del libro.</p>";
        })
        // 9 se non ci sono errori crea il modale con il bottone di chiusura
        .finally(() => {  
          bookDescription.appendChild(closeButton);
        });
    });
  });
}