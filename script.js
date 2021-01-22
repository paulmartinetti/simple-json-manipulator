/**
 * 
 * global vars
 */
// json entier
let data;
// les noms des params de chaque json
let dataNomA = ["delayStart", "rampePWM", "speedWelding", "balayage", "speedWire", "pulseWire", "retractWire", "huitieme", "neuvieme"];
let len = dataNomA.length;
// current json index
let curInd = 0;

/**
 * ALWAYS update gui from data
 * 
 */

function guiUpdate() {

  // update gui 
  for (let i = 0; i < len; i++) {
    let nom = dataNomA[i];

    // always update vals
    let s = document.getElementById(nom);
    let sv = document.getElementById(nom + "Val");
    sv.innerHTML = s.value = data[curInd][nom];
  }
}

/**
 * populate select option w json
 * https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json
 */

let dropdown = document.getElementById('designation-dropdown');
dropdown.length = 0;
dropdown.selectedIndex = 0;

const url = 'reglages.json';

const request = new XMLHttpRequest();
request.open('GET', url, true);

request.onload = function () {
  if (request.status === 200) {
    data = JSON.parse(request.responseText);
    let option;
    for (let i = 0; i < data.length; i++) {
      option = document.createElement('option');
      option.text = data[i].name;
      option.value = data[i].id;
      dropdown.add(option);
    }
  } else {
    // Reached the server, but it returned an error
  }
  // initial
  guiUpdate();
}
request.onerror = function () {
  console.error('An error occurred fetching the JSON from ' + url);
};

// c'est parti
request.send();

/**
 * selector onChange()
 * https://www.w3schools.com/jsref/event_onchange.asp
 */
function selectOnChange(curSelVal) {
  // capture curInd = current json index (groupe de valeurs)
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == curSelVal) {
      curInd = i;
      break;
    }
  }
  // maj gui avec nouveau json
  guiUpdate();
}


/**
* slider onChange() -- update session data only, do not save
* https://stackoverflow.com/questions/13896685/html5-slider-with-onchange-function
*/
function getSlider(id, newVal) {
  for (let i = 0; i < len; i++) {
    // scan params
    let nom = dataNomA[i];
    // update param of touched slider
    if (id == nom) {
      data[curInd][nom] = newVal;
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