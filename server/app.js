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
		origin: ['http://localhost:3000', 'https://ironbook-co.herokuapp.com/'], //Swap this with the client url
	})
)

app.use(express.json())

app.use(express.static(path.join(__dirname, '../client/build')))

//Routes
const postsRouter = require('./routes/post')
const usersRouter = require('./routes/users')
const commentsRouter = require('./routes/comment')
const notificationRouter = require('./routes/notification')
app.use('/api/post/', postsRouter)
app.use('/api/user/', usersRouter)
app.use('/api/comment/', commentsRouter)
app.use('/api/notification/', notificationRouter)

//Models
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

//Configs
require('./config/passport')

const PORT = process.env.PORT || 5000

app.get('*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
