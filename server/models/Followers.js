const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const FollowerSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'Users',
		required: true,
	},
	followers: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				required: true,
				ref: 'Users',
			},
		},
	],
})

module.exports = mongoose.model('Follower', FollowerSchema)
