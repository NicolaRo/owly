// Importa gli stili SCSS - webpack li gestirà automaticamente
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    static: './dist',
    port: 8800,
    open: true,
  },
  mode: 'development',
};


/* // Importa le funzioni necessarie
import { bookFinder } from './api.js';
import { renderResults, clearResults } from './dom.js';

// Event listeners e logica principale
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const selectInput = document.getElementById('select-input');

  // Event listener per il pulsante di ricerca
  searchButton.addEventListener('click', handleSearch);
  
  // Event listener per Enter nell'input
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Funzione per gestire la ricerca
  function handleSearch() {
    const query = searchInput.value.trim();
    const type = selectInput.value;

    if (!query) {
      alert('Inserisci un termine di ricerca');
      return;
    }

    if (!type) {
      alert('Seleziona il tipo di ricerca');
      return;
    }

    // Pulisci i risultati precedenti
    clearResults();
    
    // Mostra loading (opzionale)
    console.log('Ricerca in corso...');

    // Esegui la ricerca
    bookFinder(query, type)
      .then(results => {
        console.log('Risultati ottenuti:', results);
        renderResults(results);
      })
      .catch(error => {
        console.error('Errore nella ricerca:', error);
        alert('Errore durante la ricerca. Riprova.');
      });
  }
});
 */
// Test iniziale (puoi rimuoverlo dopo)
/* 
const testQuery = "harry potter";
const testType = "title";

bookFinder(testQuery, testType)
  .then(results => {
    console.log("Risultati dalla ricerca:", results);
  })
  .catch(error => {
    console.error("Errore nella ricerca:", error);
  });
*/