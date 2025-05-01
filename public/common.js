/*
common scripts for all pages (this is subject to change)
*/
async function getTheme() {
  const response = await fetch('/gettheme?user=' + window.localStorage.getItem('user'));
  let link = document.getElementById('css');
  cssFileName = await response.text();
  link.href = cssFileName;
}

function previewTheme() {
  let link = document.getElementById('css');
  let theme = document.getElementById('selection').value;
  link.href = theme;
}

async function saveTheme() {
  if (window.localStorage.getItem('user') === null) {
    alert("You must be logged in to save your theme.");
    return;
  }
  let selectedTheme = document.getElementById('selection').value;
  await fetch('/settheme?user=' + window.localStorage.getItem('user') + '&theme=' + selectedTheme);
}

function setLgnAs() {
  let lgnAs = document.getElementById('lgnAs');
  if (window.localStorage.getItem('user') === null) {
    lgnAs.innerText = 'Logged in as: Guest';
  }
  else {
    lgnAs.innerText = 'Logged in as: ' + window.localStorage.getItem('user');
  }
}

function logout() {
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('wpm');
  window.localStorage.removeItem('accuracy');
  window.localStorage.removeItem('rawWpm');
  getTheme();
  setLgnAs();
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
  let wpm = window.localStorage.getItem('wpm');
  let accuracy = window.localStorage.getItem('accuracy') * 100;
  let rawWpm = window.localStorage.getItem('rawWpm');
  wpm = Math.round(wpm * 10) / 10;
  accuracy = Math.round(accuracy * 10) / 10;
  rawWpm = Math.round(rawWpm * 10) / 10;
  if (!wpm || !accuracy || !rawWpm) {
    console.error("Error: missing results");
    return;
  }
  document.getElementById('wpm').innerText = `WPM: ${wpm}`;
  document.getElementById('accuracy').innerText = `Accuracy: ${accuracy}%`;
  document.getElementById('raw_wpm').innerText = `Raw WPM: ${rawWpm}`;
}