/**
 * 
 * global vars
 */
// json entier (données = data)
let data;
// au début on fabrique selector, ce vars rassure qu'il n'ai fabriqué qu'une fois et après, first = false
let first = true;

// les noms des params de chaque json
// keysA[0] = "delayStart"
let keysA = [];
// len = 9, du 0 au 8 chaque boucle de var "i"
let len;

// du gui, on va remplir ça une fois avec step, min, max
let sliderA = [];
// indice actuel, 0 corréspond à D1_Eco 50, 1 corréspond à D2_Janisol
let indAct;

/**
 * ALWAYS update gui from data
 * 
 */

function guiUpdate() {

  // m-à-j gui des données
  for (let i = 0; i < len; i++) {
    // nom, comme "balayage"
    let nom = keysA[i];
    // sa valeur il faut forcer Number() sinon il est traité comme texte (String)
    let val = Number(data[indAct][nom]);

    // il faut chercher de nouveau chaque slider
    let s = document.getElementById(nom);
    // et sa valeur montrée
    let sv = document.getElementById(nom + "Val");

    // les boutons plus et moins, puisque on change leurs états en fonction de min max
    let bp = document.getElementById(nom + "Plus");
    let bm = document.getElementById(nom + "Moins");

    // update gui
    sv.innerHTML = s.value = val;

    // l'expression après = on simule le prochain appuis sur + ou - , et s'il sera trop grand ou petit, on désactive le bouton
    bp.disabled = val + Number(sliderA[i].step) > Number(sliderA[i].max);
    bm.disabled = val - Number(sliderA[i].step) < Number(sliderA[i].min);
  }
}

/**
 * populate select option w json
 * https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json
 */

// il n'y a qu'un seul selector
let dropdown = document.getElementById('designation-dropdown');
// initialiser
dropdown.length = 0;
dropdown.selectedIndex = 0;

const url = 'reglages.json';

// 
const request = new XMLHttpRequest();
request.open('GET', url, true);

request.onload = function () {
  if (request.status === 200) {
    // c'est bon
    data = JSON.parse(request.responseText);
    // remplir selector
    setupGui();
  } else {
    // Reached the server, but it returned an error
  }
  // initial
  guiUpdate();
}
request.onerror = function () {
  console.error('An error occurred fetching the JSON from ' + url);
};

// c'est parti -- premier appel à une fonction
request.send();

/**
 * selector onChange()
 * https://www.w3schools.com/jsref/event_onchange.asp
 * 
 * Pulldown = selector
 */
function setupGui() {
  // fabrique une fois seulement
  if (!first) return;

  let option;
  for (const i in data) {
    option = document.createElement('option');
    option.text = data[i].nom;
    option.value = "projet"+data[i].id;
    dropdown.add(option);
  }

  // fill param key array
  indAct = "projet1";
  keysA = Object.keys(data[indAct]);
  // supprimer "id" et "name"
  keysA.splice(0,2);
  len = keysA.length;

  // remplir global var pour gérer le gui
  for (let i = 0; i < len; i++) {
    let s = document.getElementById(keysA[i]);
    let obj = {
      step: s.step,
      min: s.min,
      max: s.max
    };
    // step, min, max de chaque slider
    sliderA.push(obj);
  }

  // une fois seulement (on appel le json à chaque appuis sur selector)
  first = false;
}
// 
function selectOnChange(curSelVal) {
  // capter l'indAct = l'indice actuel du json (un groupe de valeurs)
  for (const i in data) {
    if (("projet"+data[i].id) == curSelVal) {
      // trouvé !
      indAct = "projet"+data[i].id;
      break;
    }
  }
  // rechercher le json de nouveau à chaque appuis du selector
  request.open('GET', url, true);
  request.send();
}


/**
* slider onChange() -- si tu appuis sur un slider, on m-à-j les données
* https://stackoverflow.com/questions/13896685/html5-slider-with-onchange-function
*/
function getSlider(id, newVal) {
  for (let i = 0; i < len; i++) {
    // recherche dans tous les params (balayage, speed, etc)
    let nom = keysA[i];
    // param touché
    if (id == nom) {
      // nouvelle valeur du slider, ça vient du gui
      data[indAct][nom] = Number(newVal);
      break;
    }
  }
  // update gui
  guiUpdate();
}


/**
* boutons plus et moins
* https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
*/
function onPlus(monId) {
  for (let i = 0; i < len; i++) {
    // scan params
    let nom = keysA[i];
    // identifier le bouton touché
    if (monId.includes(nom)) {
      let n = Number(data[indAct][nom]);
      // ajoute step à la valeur actuelle
      n += Number(sliderA[i].step);
      // m-à-j les données
      data[indAct][nom] = n.toFixed(2);
      break;
    }
  }
  // update gui -- toujours les données conduisent le gui !!!
  guiUpdate();
}
function onMoins(monId) {
  for (let i = 0; i < len; i++) {
    // scan params
    let nom = keysA[i];
    // update param of touched slider
    if (monId.includes(nom)) {
      let n = Number(data[indAct][nom]);
      n -= Number(sliderA[i].step);
      data[indAct][nom] = n.toFixed(2);
      break;
    }
  }
  // update gui
  guiUpdate();
}

/**
* save json to file
* https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
*/
function saveJson() {
  var a = document.createElement("a");
  let pkg = JSON.stringify(data);
  var file = new Blob([pkg], { type: 'text/plain' });
  a.href = URL.createObjectURL(file);
  a.download = 'newJson.json';
  a.click();
}