require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const MONGODB_URI =
	process.env.MONGO_URI || `mongodb://localhost/localIronPlate`

mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((x) =>
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
	)
	.catch((err) => console.error('Error connecting to mongo', err))

app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:3000', 'https://iron-clad.herokuapp.com'], //Swap this with the client url
	})
)

app.use(express.json())

app.use(express.static(path.join(__dirname, '../client/build')))

// app.use('/api', require('./routes'))

const PORT = process.env.PORT || 5000

app.get('*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
