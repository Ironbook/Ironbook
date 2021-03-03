require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('errorhandler')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')

// Set-up Mongo
const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost/localIronPlate`
const PORT = process.env.PORT || 5000
mongoose.promise = global.Promise

// Initiate Server (app)
const app = express()
const isProduction = process.env.NODE_ENV === 'production'

// Customise the app
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:3000'], //Swap this with the client url
	})
)
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client/public')))
// We need to secure this on production.
app.use(
	session({
		secret: 'Ironhack duck',
		cookie: { maxAge: 60000 },
		resave: false,
		saveUninitialized: false,
	})
)

if (!isProduction) {
	app.use(errorHandler())
}

// Lets get that DATA!
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((x) =>
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
	)
	.catch((err) => console.error('Error connecting to mongo', err))

// Add our Models and Routes
require('./models/Users')
require('./config/passport')
app.use(require('./routes'))

// Errors and Middleware
if (!isProduction) {
	app.use((err, req, res) => {
		res.status(err.status || 500)
		res.json({
			errors: {
				message: err.message,
				error: err,
			},
		})
	})
}
app.use((err, req, res) => {
	res.status(err.status || 500)
	res.json({
		errors: {
			message: err.message,
			error: {},
		},
	})
})

// Make the Server display Client.
// app.get('*', (req, res, next) => {
// 	res.sendFile(path.join(__dirname, '../client/public/index.html'))
// })

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
