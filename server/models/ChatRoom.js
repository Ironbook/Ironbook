const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const ChatRoom = new mongoose.Schema({
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	roomName: { type: String, default: '' },
	lastActive: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now },
	messages: { type: Number, default: 0 },
})

ChatRoom.statics.getRooms = function (userId) {
	return this.aggregate([
		{ $match: { members: { $in: [userId] } } },
		{
			$lookup: {
				from: 'users',
				localField: 'members',
				foreignField: '_id',
				as: 'members',
			},
		},
		{
			$lookup: {
				from: 'messages',
				as: 'lastMessage',
				let: { indicator_id: '$_id' },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$roomId', '$$indicator_id'] },
						},
					},
					{ $sort: { createdAt: -1 } },
					{ $limit: 1 },
				],
			},
		},
		{
			$project: {
				'members._id': 1,
				'members.firstName': 1,
				'members.lastName': 1,
				'members.username': 1,
				'members.profilePicture': 1,
				'members.activityStatus': 1,
				messages: 1,
				roomName: 1,
				createdAt: 1,
				lastMessage: 1,
			},
		},
		{ $sort: { 'lastMessage.createdAt': 10 } },
	])
}

module.exports = mongoose.model('ChatRoom', ChatRoom)
