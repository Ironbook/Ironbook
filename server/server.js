require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const socket_io = require('socket.io')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('errorhandler')
const express = require('express')
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
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then((x) =>
		console.log(
			`Connected to Mongo! Database name: "${x.connections[0].name}"`
		)
	)
	.catch((err) => console.error('Error connecting to mongo', err))

// Add our Models and Routes
const postsRouter = require('./routes/post')
const usersRouter = require('./routes/users')
const commentsRouter = require('./routes/comment')
const notificationRouter = require('./routes/notification')
app.use('/api/post/', postsRouter)
app.use('/api/users/', usersRouter)
app.use('/api/comment/', commentsRouter)
app.use('/api/notification/', notificationRouter)

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

app.io = io

app.set('socketio', io)

io.use((socket, next) => {
	if (socket.handshake.query && socket.handshake.query.token) {
		const token = socket.handshake.query.token.split(' ')[1]
		jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
			if (err) return next(new Error('Authentication error'))
			socket.userData = decoded
			next()
		})
	} else {
		next(new Error('Authentication error'))
	}
}).on('connection', (socket) => {
	// Connection now authenticated to receive further events
	socket.join(socket.userData.userId)
	io.in(socket.userData.userId).clients((err, clients) => {
		userController.changeStatus(socket.userData.userId, clients, io)
		//console.log(clients);
	})
	socket.on('typing', (data) => {
		socket.to(data.userId).emit('typing', { roomId: data.roomId })
	})
	socket.on('stoppedTyping', (data) => {
		socket.to(data.userId).emit('stoppedTyping', { roomId: data.roomId })
	})
	socket.on('disconnect', () => {
		socket.leave(socket.userData.userId)
		io.in(socket.userData.userId).clients((err, clients) => {
			userController.changeStatus(socket.userData.userId, clients, io)
			//console.log(clients);
		})
	})
})

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 min
// 	max: 200, //  IP limit to 200 requests
// })

// app.use(helmet())
// if (process.env.NODE_ENV === 'production') {
// 	app.use(limiter)
// 	app.use(
// 		logger('common', {
// 			stream: fs.createWriteStream('./access.log', { flags: 'a' }),
// 		})
// 	)
// } else {
// 	app.use(logger('dev'))
// }

app.get('/auth/reset/password/:jwt', function (req, res) {
	return res.status(404).json({ message: 'go to port 3000' })
})

app.get('*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'))
	console.log('Hello from the build')
})

console.log('Hello from the end of the server')
if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
}
module.exports = { app }
