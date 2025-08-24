// Debouncing --> Effettua la chiamata API solo dopo 500ms dall'ultima lettera premuta nel campo di ricerca 
// (migliora gestione banda e riduce consumo elettrico/impegno del server)

// Funzione di debounce riduce il numero di chiamate API consentendo all'utente di digitare prima di passare la query fornita
export function debounce(func, wait = 500) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

export function debugLog(...args) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}