import axios from "axios"; // Importo il pacchetto AXIOS per inoltrare richieste HTTP tramite API
import placeholderImage from "../img/book-cover-placeholder.jpg"; // Importa direttamente nel .js anche l'imagine di placeholder che utilizzerò in caso manchi la cover dalla API

const baseUrl = process.env.API_BASE_URL; // imposto URL di base dell'API preso dalla variabile ambiente API_BASE_URL definita in dotenv.env

export function bookFinder(query, type) {
  // Esporto la funzione bookFinder che accetta parametri: query e select

  const fullUrl = `${baseUrl}/search.json?${type}=${encodeURIComponent(query)}`; // fullUrl aggiunge i parametri type e query inseriti dall'utente, all'url base. Trasmette la chiamata API secondo le indicazioni inserite.

  console.log("URL richiesta:", fullUrl); // Mostro a console l'URL completo per il debug

  if (!type) {
    // se il type non selezionato (quindi nullo)
    alert("Seleziona il tipo di ricerca."); // mostra questo messaggio in un alert
    return; // e termina la funzione
  }

  return axios
    .get(fullUrl) // Return della Promise
    .then((response) => {
      const allResults = response.data.docs;
      /* const tenResults = allResults.length >= 10 ? allResults.slice(0, 10) : allResults; // Se i risultati sono più di 10, mostra solo i primi 10. linea commentata per eventuali future implementazioni*/

      console.log("tutti i risultati", allResults);

      return allResults; // ritorno i risultati
    });
}

export function getBookDetails(bookKey) {
  // Funzione per ottenere i dettagli del libro
  console.log("Verifica bookKey", bookKey); // Verifica a console la bookKey
  const fullUrl = `${baseUrl}${bookKey}.json`; // Compone un nuovo URL per chiamata API includendo la bookKey del libro di cui l'utente vuole ottenere la descrizione.
  console.log("URL dettagli libro:", fullUrl); // Ottengo a console l'URL composto e trasmesso per debug

  return axios.get(fullUrl).then((response) => {
    console.log("Dettagli libro ottenuti:", response.data);
    const details = response.data; // Ottengo i dettagli

    // Normalizza gli autori
    if (!details.author_name && details.authors) {
      details.author_name = ["Autore"]; // Placeholder per ora
    }

    return details;
  });
}
  // Funzione per ottenere la copertina del libro

export function bookCover(coverId) {
  if (!coverId) { // Se NON ottiene la coverId..
    return placeholderImage; // Usa l'immagine placeholder importata all'inizio
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}
