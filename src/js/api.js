// Importo il pacchetto AXIOS per inoltrare richieste HTTP tramite API
import axios from "axios";

// Importa direttamente nel .js anche l'imagine di placeholder che utilizzerò in caso manchi la cover dalla API
import placeholderImage from "../img/book-cover-placeholder.jpg"; 

// imposto URL di base dell'API preso dalla variabile ambiente API_BASE_URL definita in dotenv.env
const baseUrl = process.env.API_BASE_URL; 

// 1. Esporto la funzione bookFinder che accetta parametri: query e select
export function bookFinder(query, type) {
  

  // 1.1. fullUrl aggiunge i parametri type e query inseriti dall'utente, all'url base. Trasmette la chiamata API secondo le indicazioni inserite.
  const fullUrl = `${baseUrl}/search.json?${type}=${encodeURIComponent(query)}`; 

  // Mostro a console l'URL completo per il debug
  console.log("URL richiesta:", fullUrl); 

  
  if (!type) {
    
    // mostra questo messaggio in un alert
    alert("Seleziona il tipo di ricerca."); // SOSTITUIRE ALERT CON UN MODALE (e poi dagli l'aria-label)
    return; // e termina la funzione
  }

  // Return della Promise
  return axios
    .get(fullUrl) 
    .then((response) => {
      const allResults = response.data.docs;
    
      console.log("tutti i risultati", allResults); // Mostro a console i risultati ottenuti per debug

      // Ottengo i risultati e li restituisco
      return allResults; 
    });
}

// 2. Esporto la funzione getBookDetails che accetta un parametro bookKey
// 2.1. Questa funzione serve per ottenere i dettagli di un libro specifico, come titolo, autore, descrizione, copertina, ecc.
export function getBookDetails(bookKey) {

  // Funzione per ottenere i dettagli del libro
  // 2.2. Verifica a console la bookKey
  console.log("Verifica bookKey", bookKey);

  // 2.3. Compone un nuovo URL per chiamata API includendo la bookKey del libro di cui l'utente vuole ottenere la descrizione.
  const fullUrl = `${baseUrl}${bookKey}.json`;

  // Ottengo a console l'URL composto e trasmesso per debug
  console.log("URL dettagli libro:", fullUrl); 

  // 2.4. Effettua la richiesta GET all'API per ottenere i dettagli del libro
  // 2.5. Se la bookKey è falsy (null, undefined, ecc.) non effettua la richiesta e mostra un messaggio di errore
  return axios.get(fullUrl).then((response) => {
    console.log("Dettagli libro ottenuti:", response.data);
    const details = response.data; // Ottengo i dettagli

    // 2.6. Normalizza gli autori
    if (!details.author_name && details.authors) {
      details.author_name = ["Autore"]; // Se non c'è author_name, ma ci sono autori, assegno un valore di default
    }

    // 2.7. Normalizza la descrizione
    // Open Library API restituiscono le descrizioni in formati diversi, così mi assicuro di mostrarli tutti.
    if (details.description && typeof details.description === 'object' && details.description.value) { 
      details.description = details.description.value;
    }

    return details;
  });
}
  // 3. Funzione per ottenere la copertina del libro
  // // 3.1. Se il coverId è falsy (null, undefined, ecc.) restituisce un'immagine di placeholder

export function bookCover(coverId) {
  if (!coverId || coverId === "null"|| coverId === "undefined") { // Se coverId è falsy (sia "null", "undefined" come valore o come stringa)
    
    // Usa l'immagine placeholder importata all'inizio
    return placeholderImage;
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}
