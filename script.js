/**
 * 
 * global vars
 */
// json entier
let data;
// selector reloads data, build once only
let first = true;
// les noms des params de chaque json
let dataNomA = ["delayStart", "rampePWM", "speedWelding", "balayage", "speedWire", "pulseWire", "retractWire", "huitieme", "neuvieme"];
// *** la valeur de + ou - correspond à chaque param
let stepA = [100,5,.5,.1,1,1,1,1,1];
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
    // data
    let nom = dataNomA[i];
    let val = Number(data[curInd][nom]);
    console.log(val);

    // always update vals
    let s = document.getElementById(nom);
    let max = s.max;
    let min = s.min;
    let sv = document.getElementById(nom + "Val");

    // les boutons plus et moins
    let bp = document.getElementById(nom + "Plus");
    let bm = document.getElementById(nom + "Moins");
    
    // update gui
    sv.innerHTML = s.value = val;
    bp.disabled = val+stepA[i]>max;
    bm.disabled = val-stepA[i]<min;
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
    setupPulldown();
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
 * 
 */
function setupPulldown(){
  // build only one time
  if (!first) return;

  let option;
  for (let i = 0; i < data.length; i++) {
    option = document.createElement('option');
    option.text = data[i].name;
    option.value = data[i].id;
    dropdown.add(option);
  }
  // avoid repeats
  first = false;
}
function selectOnChange(curSelVal) {
  // capture curInd = current json index (groupe de valeurs)
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == curSelVal) {
      curInd = i;
      break;
    }
  }
  // always use original data
  request.open('GET', url, true);
  request.send();
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
* boutons plus et moins
* https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
*/
function onPlus(monId) {
  for (let i = 0; i < len; i++) {
    // scan params
    let nom = dataNomA[i];
    // update param of touched slider
    if (monId.includes(nom)) {
      let n = Number(data[curInd][nom]);
      n += stepA[i];
      data[curInd][nom] = n.toFixed(2);
      break;
    }
  }
  // update gui
  guiUpdate();
}
function onMoins(monId) {
  for (let i = 0; i < len; i++) {
    // scan params
    let nom = dataNomA[i];
    // update param of touched slider
    if (monId.includes(nom)) {
      let n = Number(data[curInd][nom]);
      n -= stepA[i];
      data[curInd][nom] = n.toFixed(2);
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