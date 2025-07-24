// dom.js - Gestisce solo la manipolazione del DOM

// Funzione per pulire i risultati precedenti
export function clearResults() {
  const existingResults = document.querySelector('.results-container');
  if (existingResults) {
    existingResults.remove();
  }
}

// Funzione per renderizzare i risultati
export function renderResults(books) {
  console.log('Dom.js riceve questi libri:', books);
  
  // 1. Pulisci risultati precedenti
  clearResults();
  
  // 2. Crea un container per i risultati (perché non esiste nell'HTML)
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';
  
  // 3. Inserisci il container nella pagina (dopo la hero-section)
  const heroSection = document.querySelector('.hero-section');
  heroSection.insertAdjacentElement('afterend', resultsContainer);
  
  // 4. Se non ci sono libri, mostra messaggio
  if (!books || books.length === 0) {
    resultsContainer.innerHTML = '<p>Nessun risultato trovato</p>';
    return;
  }
  
  // 5. Crea HTML per ogni libro
  books.forEach((book, index) => {
    // Crea un div per ogni libro
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-result';
    
    // Genera un ID unico per questo libro
    const bookId = `book-${index}-${Date.now()}`;
    bookDiv.setAttribute('data-book-id', bookId);
    
    // Inserisci i dati del libro nell'HTML
    bookDiv.innerHTML = `
      <h3>${book.title || 'Titolo non disponibile'}</h3>
      <p><strong>Autore:</strong> ${book.author_name ? book.author_name.join(', ') : 'Autore non disponibile'}</p>
      <p><strong>Anno:</strong> ${book.first_publish_year || 'Anno non disponibile'}</p>
      <button onclick="alert('Dettagli libro ID: ${bookId}')">Dettagli</button>
    `;
    
    // Aggiungi questo libro al container
    resultsContainer.appendChild(bookDiv);
  });
}