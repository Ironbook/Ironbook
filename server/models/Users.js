const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const postLikeSchema = new mongoose.Schema({
	post: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Post',
	},
})

const commentLikeSchema = new mongoose.Schema({
	comment: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Comment',
	},
})

const commentReplyLikeSchema = new mongoose.Schema({
	comment: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Reply',
	},
})

const UsersSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 30,
		trim: true,
		match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
	},
	lastName: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 30,
		trim: true,
		match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
	},
	username: {
		type: String,
		minlength: 3,
		maxlength: 30,
		trim: true,
		match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
		maxlength: 40,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	profilePicture: {
		type: String,
		default: 'person.png',
	},
	userClass: {
		type: String,
		default: 'member',
	},
	hash: String,
	salt: String,
	postLikes: [postLikeSchema],
	commentLikes: [commentLikeSchema],
	commentReplyLikes: [commentReplyLikeSchema],
})

UsersSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex')
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'SHA3-512')
		.toString('hex')
}

UsersSchema.methods.validatePassword = function (password) {
	const hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, 'SHA3-512')
		.toString('hex')
	return this.hash === hash
}

UsersSchema.methods.generateJWT = function () {
	const today = new Date()
	const expirationDate = new Date(today)
	expirationDate.setDate(today.getDate() + 60)

	return jwt.sign(
		{
			email: this.email,
			id: this._id,
			exp: parseInt(expirationDate.getTime() / 1000, 10),
		},
		'secret'
	)
}

UsersSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		email: this.email,
		token: this.generateJWT(),
	}
}

mongoose.model('Users', UsersSchema)
