var words = "";
var wordsArray = [];
var wrongLetters = [];
var timing = false;
var start = null;
var end = null;
var numWords = 25; // default starting value

function setUpEvent() {
  let text = document.getElementById('text');
  text.addEventListener('input', function () {
    let typed = text.value;
    let typedWords = typed.split(" ");
    let html = "";

    if (!timing) {
      start = new Date();
      timing = true;
    }

    if (typedWords.length - 1 === wordsArray.length ||
      (typedWords.length === wordsArray.length) && typedWords[typedWords.length - 1] === wordsArray[wordsArray.length - 1]) {
      end = new Date();
      timing = false;

      let numChars = wordsArray.join("").length;
      let numWordsCalc = numChars / 5;
      let seconds = (end - start) / 1000;
      let minutes = seconds / 60;
      let numCharsWrong = wrongLetters.length + numChars - typedWords.join("").length;
      let accuracy = (numChars - numCharsWrong) / numChars;
      let rawWpm = numWordsCalc / minutes;
      let wpm = rawWpm * accuracy;

      window.localStorage.setItem('wpm', wpm);
      window.localStorage.setItem('accuracy', accuracy);
      window.localStorage.setItem('rawWpm', rawWpm);

      const username = localStorage.getItem('user') || "Guest";
      let data = { username, wpm, accuracy, numWords };


      fetch('/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.text())
        .then(text => {
          document.open();
          document.write(text);
          document.close();
        })
        .catch(err => {
          console.log(err);
        });
    }

    for (let i = 0; i < wordsArray.length; i++) {
      if (i < typedWords.length - 1) {
        if (typedWords[i] === wordsArray[i]) {
          html += `<span style="color: green;">${wordsArray[i]}</span> `;
        } else {
          html += `<span style="color: red;">${wordsArray[i]}</span> `;
        }
      } else if (i === typedWords.length - 1) {
        if (typedWords[i] === wordsArray[i].substring(0, typedWords[i].length)) {
          html += `<span style="color: blue; text-decoration: underline;">${wordsArray[i]}</span> `;
        } else {
          html += `<span style="color: red; text-decoration: underline;">${wordsArray[i]}</span> `;
        }
        // checking if the letter that was just typed is wrong
        let charIndex = typedWords[i].length - 1
        if (charIndex < wordsArray.length && typedWords[i].charAt(charIndex) != wordsArray[i].charAt(charIndex)) {
          // checking if the letter has not yet been counted as wrong
          if (!contains(i, charIndex)) {
            wrongLetters.push([i, charIndex])
          }
        }
      } else {
        html += `<span>${wordsArray[i]}</span> `;
      }
    }
    document.getElementById("words").innerHTML = html;
  });
}

function contains(wordIndex, charIndex) {
  for (let i = 0; i < wrongLetters.length; i++) {
    if (wrongLetters[i][0] === wordIndex && wrongLetters[i][1] === charIndex) {
      return true;
    }
  }
  return false;
}

function getWords(n) {
  numWords = n; // track selection
  wrongLetters = [];
  fetch('/type', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numWords: n })
  })
    .then(res => res.text())
    .then(text => {
      words = text;
      wordsArray = text.split(" ");
      document.getElementById('words').innerText = words;
    })
    .catch(err => {
      console.log(err);
    });
}

function disablePaste() {
  let text = document.getElementById('text');
  text.onpaste = e => e.preventDefault();
}