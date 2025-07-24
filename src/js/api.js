import axios from "axios"; // Importo il pacchetto AXIOS per inoltrare richiete HTTP tramite API

export function bookFinder(query, type) {  // Esporto la funzione bookFinder che accetta parametri: query e select
  // TUTTO il codice che usa query e type deve stare QUI DENTRO
  const baseUrl = process.env.API_BASE_URL; // imposto URL di base dell'API preso dalla variabile ambiente API_BASE_URL definita in dotenv.env
  const fullUrl = `${baseUrl}?${type}=${encodeURIComponent(query)}`; // fullUrl aggiunge i parametri type e query all'url base così la API va a cercare secondo le indicazioni dell'utente.
  console.log("URL richiesta:", fullUrl); // Mostro a console l'URL completo per il debug // ✅ Dentro la funzione
  
  if (!type) { // se il type non selezionato (quindi nullo)
    alert("Seleziona il tipo di ricerca."); // mostra un alert
    return; // e termina la funzione
  }
  return axios.get(fullUrl) // ✅ Return della Promise
    
    .then(response => {
      const allResults = response.data.docs;

      const tenResults = allResults.length >= 10 ? allResults.slice(0, 10) : allResults; // Se i risultati sono più di 10, mostra solo i primi 10.
      
      console.log("Primi 10 risultati:", tenResults); // Mostro i primi 10 risultati a console per il debug

      return tenResults; // ritorno i primi 10 risultati
 
    });
  };













  /* // Funzione per gestire la ricerca
  function handleSearch() {
    const query = searchInput.value.trim();
    const type = selectInput.value;

    if (!query) {
      alert("Inserisci un termine di ricerca");
      return;
    }

    if (!type) {
      alert("Seleziona il tipo di ricerca");
      return;
    }

    // Pulisci i risultati precedenti
    clearResults();

    // Mostra loading (opzionale)
    console.log("Ricerca in corso...");

    // Esegui la ricerca
    bookFinder(query, type)
      .then((results) => {
        console.log("Risultati ottenuti:", results);
        renderResults(results);
      })
      .catch((error) => {
        console.error("Errore nella ricerca:", error);
        alert("Errore durante la ricerca. Riprova.");
      });
  } */