var express = require('express')
var app = express()
var path = require('path')
var fs = require('fs')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:337final337@typer.kfarv9d.mongodb.net/?retryWrites=true&w=majority&appName=Typer";

// client initialization
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// public folder path
var rootFolder = path.join(__dirname, 'public/')

// the list of all possible words
var words = getWords()

app.get('/type', (req, res) => {
    res.sendFile(path.join(rootFolder, 'type.html'))
})

app.post('/type', express.json(), (req, res) => {
    res.send(generateWords(req.body.numWords))
})

app.post('/score', express.json(), (req, res) => {
    /*
    if (isValidUser(req.body.username, req.body.password)) {
        // store users results
    }*/
    res.sendFile(path.join(rootFolder, 'score.html'))
})

// will need to fix this depending on database
// it will check if a user exists with the given username and password
async function isValidUser(username, hashedPassword) {
    if (req.body.username == null || req.body.password == null) {
        return false;
    }
    try {
        await client.connect()
    
        var db = client.db('TypingGameDB')
        var coll = db.collection('Users')
        var user = await coll.findOne({'username': username, 'password': hashedPassword})
        if (user == null || user == undefined) {
            return false;
        }

        await client.close()
    } catch (err) {
        console.log(err)
    }
    return true;
}

// gets all words from the words.txt file
function getWords() {
    try {
        return String(fs.readFileSync(path.join(rootFolder, 'words.txt')), {'encoding': 'utf8'}).split(/\s+/)
    } catch (err) {
        console.log(err)
    }
}

// generates a string of random words separated by " "
function generateWords(num_words) {
    let result = []
    for(let i = 0; i < num_words; i++) {
        let randIndex = Math.floor(Math.random() * words.length)
        result.push(words[randIndex])
    }
    return result.join(" ")
}

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000')
})