const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const FollowingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'Users',
		required: true,
	},
	following: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				required: true,
				ref: 'Users',
			},
		},
	],
})

module.exports = mongoose.model('Following', FollowingSchema)
