const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const CommentLikeSchema = new mongoose.Schema({
	comment: { type: mongoose.Schema.ObjectId, required: true, ref: 'Comment' },
	users_likes: [
		{
			author: {
				type: mongoose.Schema.ObjectId,
				required: true,
				ref: 'Users',
			},
		},
	],
})

module.exports = mongoose.model('CommentLike', CommentLikeSchema)
