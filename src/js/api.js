import axios from "axios"; // Importo il pacchetto AXIOS per inoltrare richiete HTTP tramite API

export function bookFinder(query, type) {  // Esporto la funzione bookFinder che accetta parametri: query e select
  // TUTTO il codice che usa query e type deve stare QUI DENTRO
  const baseUrl = "https://openlibrary.org/search.json"; // imposto URL di base dell'API
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