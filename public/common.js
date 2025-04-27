/*
common scripts for all pages (this is subject to change)
*/

function changeCSS() { // im using this for testing preset themes, which cant be fully implemented until we have a user system
    let css = document.getElementById('css');
    if (css.href.endsWith("style1.css")) {
      css.href = "style2.css";
    } else {
      css.href = "style1.css";
    }
}

function displayMenu() {
    let menu = document.getElementById('menu');
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
}

function displayResults() {
  let wpm      = window.localStorage.getItem('wpm');
  let accuracy = window.localStorage.getItem('accuracy') * 100;
  let rawWpm   = window.localStorage.getItem('rawWpm');
  wpm      = Math.round(wpm * 10) / 10;
  accuracy = Math.round(accuracy * 10) / 10;
  rawWpm   = Math.round(rawWpm * 10) / 10;
  if (!wpm || !accuracy || !rawWpm) {
    console.error("Error: missing results");
    return;
  }
  document.getElementById('wpm').innerText      = `WPM: ${wpm}`;
  document.getElementById('accuracy').innerText = `Accuracy: ${accuracy}%`;
  document.getElementById('raw_wpm').innerText  = `Raw WPM: ${rawWpm}`;
}