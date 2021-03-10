require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('errorhandler')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')

console.log('Hello from the start of the server')
// Set-up Mongo
const MONGO_URI = process.env.MONGO_URI
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
// app.use(express.static(path.join(__dirname, '../client/public')))

// We need to secure this on production.
app.use(
	session({
		secret: process.env.SECRET,
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
// app.use(require('./routes'))
const postsRouter = require('./routes/post')
const usersRouter = require('./routes/users')
const commentsRouter = require('./routes/comment')
const notificationRouter = require('./routes/notification')

require('./models/Comment')
require('./models/CommentLike')
require('./models/CommentReply')
require('./models/CommentReplyLike')
require('./models/Followers')
require('./models/Following')
require('./models/Notification')
require('./models/Post')
require('./models/PostLike')
require('./models/Users')
require('./config/passport')
app.use('/api/post/', postsRouter)
app.use('/api/users/', usersRouter)
app.use('/api/comment/', commentsRouter)
app.use('/api/notification/', notificationRouter)

const userController = require('./controllers/userController')
// Errors and Middleware
// if (!isProduction) {
// 	app.use((err, req, res) => {
// 		res.status(err.status || 500)
// 		res.json({
// 			errors: {
// 				message: err.message,
// 				error: err,
// 			},
// 		})
// 	})
// }

// app.use((err, req, res) => {
// 	res.status(err.status || 500)
// 	res.json({
// 		errors: {
// 			message: err.message,
// 			error: {},
// 		},
// 	})
// })

// app.get('/auth/reset/password/:jwt', function (req, res) {
// 	return res.status(404).json({ message: 'go to port 3000' })
// })

// app.use((req, res, next) => {
// 	next(createError(404))
// })

// app.use((err, req, res, next) => {
// 	console.log(err)
// 	res.status(err.status || 500)
// 	res.json({
// 		error: {
// 			message: err.message,
// 		},
// 	})
// })

// Make the Server display Client.
// app.get('*', (req, res, next) => {
// 	res.sendFile(path.join(__dirname, '../client/public/index.html'))
// })
app.get('*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'))
	console.log('Hello from the build')
})
console.log('Hello from the end of the server')
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
