// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI = "mongodb+srv://admin:337final337@typer.kfarv9d.mongodb.net/?retryWrites=true&w=majority&appName=Typer";
const DB_NAME = "Typer";
const COLL = "leaderboard";
const PORT = 3000;

// Load word list
const WORDS = fs.readFileSync(path.join(__dirname,'public/words.txt'), 'utf8')
  .split(/\r?\n/)
  .filter(Boolean);

function pickRandomWords(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * WORDS.length);
    out.push(WORDS[idx]);
  }
  return out;
}

;(async function startServer() {
  const client = new MongoClient(MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
  });

  try {
    await client.connect();
    console.log('✅ MongoDB connected');
    const db = client.db(DB_NAME);
    const scores = db.collection(COLL);

    const app = express();
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));

    // Fetch random words
    app.post('/type', (req, res) => {
      const { numWords } = req.body;
      if (typeof numWords !== 'number' || numWords < 1) {
        return res.status(400).send('Invalid numWords');
      }
      const arr = pickRandomWords(numWords);
      res.send(arr.join(' '));
    });

    // Save a new score
    app.post('/score', async (req, res) => {
      const { username = 'Anonymous', wpm, accuracy, numWords } = req.body;
      if (typeof wpm !== 'number' || typeof numWords !== 'number') {
        return res.status(400).send('Invalid WPM or numWords');
      }
      await scores.insertOne({ username, wpm, accuracy, numWords, createdAt: new Date() });
      res.sendFile(path.join(__dirname, 'public', 'score.html'));
    });

    // Fetch leaderboard by numWords
    app.get('/api/leaderboard', async (req, res) => {
      const numWords = Number(req.query.numWords);
      const filter = isNaN(numWords) ? {} : { numWords: numWords };
      const top10 = await scores.find(filter)
        .toArray();
      res.json(top10);
    });

    // Routes
    app.get(['/', '/type'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'type.html')));
    app.get('/score', (req, res) => res.sendFile(path.join(__dirname, 'public', 'score.html')));
    app.get('/leaderboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'leaderboard.html')));

    app.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Fatal error starting server:', err);
    process.exit(1);
  }
})();