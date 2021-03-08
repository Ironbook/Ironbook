import React, { useState, useEffect } from 'react';
import actions from '../api';

function Profile(props) {
	const [user, setUser] = useState({
		firstName: 'Roger',
		lastName: 'Federer',
		userName: 'The GOAT',
		email: 'thegoat@gmail.com',
		profilePicture:
			'https://tennishead.net/wp-content/uploads/2021/03/Roger-Federer-Australian-Open-2020.jpg',
		userClass: 'member',
		//     postLikes: [postLikeSchema],
		// commentLikes: [commentLikeSchema],
		// commentReplyLikes: [commentReplyLikeSchema]
	});
	useEffect(() => {
		console.log(props);
	}, []);

	return (
		<div>
			<div>{user.userName}</div>
			<img src={user.profilePicture} />
		</div>
	);
}

export default Profile;

// const postLikeSchema = new mongoose.Schema({
// 	post: {
// 		type: mongoose.Schema.ObjectId,
// 		required: true,
// 		ref: 'Post',
// 	},
// })

// const commentLikeSchema = new mongoose.Schema({
// 	comment: {
// 		type: mongoose.Schema.ObjectId,
// 		required: true,
// 		ref: 'Comment',
// 	},
// })

// const commentReplyLikeSchema = new mongoose.Schema({
// 	comment: {
// 		type: mongoose.Schema.ObjectId,
// 		required: true,
// 		ref: 'Reply',
// 	},
// })

// firstName: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 30,
//     trim: true,
//     match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
// },
// lastName: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 30,
//     trim: true,
//     match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
// },
// userName: {
//     type: String,
//     minlength: 3,
//     maxlength: 30,
//     trim: true,
//     match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
//     required: true,
//     unique: true,
// },
// email: {
//     type: String,
//     trim: true,
//     required: true,
//     maxlength: 40,
//     unique: true,
//     match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
// },
// profilePicture: {
//     type: String,
//     default: 'person.png',
// },
// userClass: {
//     type: String,
//     default: 'member',
// },
// hash: String,
// salt: String,
// postLikes: [postLikeSchema],
// commentLikes: [commentLikeSchema],
// commentReplyLikes: [commentReplyLikeSchema],
// })
