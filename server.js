'use strict';

const express = require('express')
const mongo = require('mongodb')
const app = express()

app.use(express.static('static'))

// careful: this is configured for a *local* mongo
// use appropriate hostname when using docker-compose!
const url = 'mongodb://localhost:27017'
let db

// connect to mongo
mongo.MongoClient.connect(url)
	.then(client => {
		console.log(client)
		return client.db('riko493')
	})
	.then(function (db) {
		console.log(db)
		return db.createCollection('favorites')
	})
	.then(result => {
		db = result
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});

app.use('/favorites*', express.json())
app.get('/favorites', (req, res) => {
  db.find({}).toArray()
		.then((result) => {
			console.log(result)
			res.json(result).end()
		})
		.catch((err) => { 
			console.log(err)
			res.status(400).send(err).end()
		})
})

app.delete('/favorites/:id', function (req, res) {
	db.deleteOne({'_id': mongo.ObjectId(req.params.id)})
		.then((result) => {
			console.log(result)
			res.status(204).end()
		})
		.catch((err) => {
			console.log(err)
			res.status(404).end()
		})
})

app.post('/favorites/', (req, res) => {
	db.insertOne(req.body)
		.then((result) => {
			console.log(result)
			res.status(201).json(req.body).end()
		})
		.catch((err) => {
			console.log(err)
			res.status(400).send(err).end()
		})
});

app.listen(3000, 
	() => console.log("Example app.js listening on port 3000!"))
