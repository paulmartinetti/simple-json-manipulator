/**
 * 
 * global vars
 */
// json 
let data;
// params dans chaque json
// keyA = ["startDelay", "speed"..etc];
let keyA = [];
let keys = false;
// len = 9, du 0 au 8 chaque boucle de var "i"
let len = 0;

// les noms des projets, chacun son json à lui
let projetA = ["D1_Eco_50", "D2_Janisol", "Janisol_2"];
let url;

// du gui, on va remplir ça une fois avec step, min, max
let sliderA = [];

/**
 * 
 * Pulldown = projet selector
 */
function setupPulldown() {

  // il n'y a qu'un seul selector
  let dropdown = document.getElementById('designation-dropdown');
  // initialiser
  dropdown.length = 0;
  dropdown.selectedIndex = 0;
  // utilise projetA
  let option;
  for (let i = 0; i < projetA.length; i++) {
    option = document.createElement('option');
    option.text = projetA[i];
    option.value = i;
    dropdown.add(option);
  }

  // initialiser selector, chercher json, maj gui
  selectOnChange(0);
}

// 
function selectOnChange(curSelVal) {
  // rechercher un json de nouveau à chaque appuis du selector
  url = projetA[curSelVal] + ".json"
  request.open('GET', url, true);
  request.send();
}


/**
 * rechercher un json
 */
const request = new XMLHttpRequest();
request.onload = function () {
  if (request.status === 200) {
    // c'est bon
    data = JSON.parse(request.responseText);
    getKeys();
  } else {
    // Reached the server, but it returned an error
  }
  // initial
  guiUpdate();
}
request.onerror = function () {
  console.error('An error occurred fetching the JSON from ' + url);
};

function getKeys(){

  // une fois
  if(keys) return;

  keyA = Object.keys(data);
  len = keyA.length;
  // remplir global var pour gérer le gui
  for (let i = 0; i < len; i++) {
    // prendre des données du gui
    let s = document.getElementById(keyA[i]);
    let obj = {
      step: s.step,
      min: s.min,
      max: s.max
    };
    // step, min, max de chaque slider
    sliderA.push(obj);
  }
  // on a les clés, il faut pas répéter
  keys = true;
}

// c'est parti - appelle une foi
setupPulldown();

/**
 * ALWAYS update gui from data
 * 
 */

function guiUpdate() {

  // m-à-j gui des données
  for (let i = 0; i < len; i++) {
    // param comme "balayage"
    let param = keyA[i];
    // sa valeur il faut forcer Number() sinon il est traité comme texte (String)
    let val = Number(data[param]);

    // il faut chercher de nouveau chaque slider
    let s = document.getElementById(param);
    // et sa valeur montrée
    let sv = document.getElementById(param + "Val");

    // les boutons plus et moins, puisque on change leurs états en fonction de min max
    let bp = document.getElementById(param + "Plus");
    let bm = document.getElementById(param + "Moins");

    // update gui
    sv.innerHTML = s.value = val;

    // l'expression après = on simule le prochain appuis sur + ou - , et s'il sera trop grand ou petit, on désactive le bouton
    bp.disabled = val + Number(sliderA[i].step) > Number(sliderA[i].max);
    bm.disabled = val - Number(sliderA[i].step) < Number(sliderA[i].min);
  }
}

/**
* slider onChange() -- si tu appuis sur un slider, on m-à-j les données
* https://stackoverflow.com/questions/13896685/html5-slider-with-onchange-function
*/
function getSlider(id, newVal) {
  for (let i = 0; i < len; i++) {
    // recherche dans tous les params (balayage, speed, etc)
    let param = keyA[i];
    // param touché
    if (id == param) {
      // nouvelle valeur du slider, ça vient du gui
      data[param] = newVal;
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
    let param = keyA[i];
    // identifier le bouton touché
    if (monId.includes(param)) {
      let n = Number(data[param]);
      // ajoute step à la valeur actuelle
      n += Number(sliderA[i].step);
      // m-à-j les données
      data[param] = n.toFixed(2);
      break;
    }
  }
  // update gui -- toujours les données conduisent le gui !!!
  guiUpdate();
}
function onMoins(monId) {
  for (let i = 0; i < len; i++) {
    // scan params
    let param = keyA[i];
    // update param of touched slider
    if (monId.includes(param)) {
      let n = Number(data[param]);
      n -= Number(sliderA[i].step);
      data[param] = n.toFixed(2);
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
  a.download = url;
  a.click();
}