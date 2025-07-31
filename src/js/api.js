import axios from "axios"; // Importo il pacchetto AXIOS per inoltrare richieste HTTP tramite API
const baseUrl = process.env.API_BASE_URL; // imposto URL di base dell'API preso dalla variabile ambiente API_BASE_URL definita in dotenv.env
export function bookFinder(query, type) {
  // Esporto la funzione bookFinder che accetta parametri: query e select
  // TUTTO il codice che usa query e type deve stare QUI DENTRO

  const fullUrl = `${baseUrl}/search.json?${type}=${encodeURIComponent(query)}`; // fullUrl aggiunge i parametri type e query all'url base così la API va a cercare secondo le indicazioni dell'utente.

  console.log("URL richiesta:", fullUrl); // Mostro a console l'URL completo per il debug

  if (!type) {
    // se il type non selezionato (quindi nullo)
    alert("Seleziona il tipo di ricerca."); // mostra un alert
    return; // e termina la funzione
  }

  return axios
    .get(fullUrl) // Return della Promise
    .then((response) => {
      const allResults = response.data.docs;
      /* const tenResults = allResults.length >= 10 ? allResults.slice(0, 10) : allResults; // Se i risultati sono più di 10, mostra solo i primi 10. */

      console.log("tutti i risultati", allResults); 

      return allResults; // ritorno i primi 10 risultati
    });
}

export function getBookDetails(bookKey) {
  console.log("Verifica bookKey", bookKey);

  const fullUrl = `${baseUrl}${bookKey}.json`;
  console.log("URL dettagli libro:", fullUrl);

  return axios.get(fullUrl).then((response) => {
    console.log("Dettagli libro ottenuti:", response.data);
    return response.data;
  });
  
}
export function bookCover(coverId) {
  // Funzione per ottenere la copertina del libro
  if (!coverId) {
    return "src/img/book-cover-placeholder.jpg"; // Restituisce un'immagine di segnaposto se non c'è un coverId
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`; // Restituisce l'URL della copertina del libro
}
