var express = require('express')
var app = express()
var path = require('path')
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

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000')
})