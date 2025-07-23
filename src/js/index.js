/* import axios from "axios";
import '../scss/style.scss'; // Importo il file SCSS per gli stili

import { renderResults } from './dom.js'; */

import { bookFinder } from "./api.js";
import { bookFinder } from './api.js';

const testQuery = "harry potter";
const testType = "title";

bookFinder(testQuery, testType)
  .then(results => {
    console.log("Risultati dalla ricerca:", results);
  })
  .catch(error => {
    console.error("Errore nella ricerca:", error);
  });
