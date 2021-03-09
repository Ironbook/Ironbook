import React, { useEffect, useState } from 'react';
// import { userActions } from '../actions/userActions';
function Home(props) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		// get the posts from database and then
		setPosts([
			{
				description:
					'ALorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
				photo: 'https://wallpaperaccess.com/full/82955.jpg',
				createdAt: new Date(),
				author: 'Novak Djokovic',
				hashtags: ['#djokovicsucks', '#federeristhegoat', '#nadal'],
				tags: ['Conan'],
				location: '',
			},
			{
				description:
					'BLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
				photo: 'https://wallpaperaccess.com/full/82955.jpg',
				createdAt: new Date(),
				author: 'Novak Djokovic',
				hashtags: ['#djokovicsucks', '#federeristhegoat', '#nadal'],
				tags: ['Conan'],
				location: '',
			},
			{
				description:
					'CLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
				photo: 'https://wallpaperaccess.com/full/82955.jpg',
				createdAt: new Date(),
				author: 'Novak Djokovic',
				hashtags: ['#djokovicsucks', '#federeristhegoat', '#nadal'],
				tags: ['Conan'],
				location: '',
			},
		]);
	}, []);

	const showPosts = () => {
		console.log(posts);
		return posts.map((eachpost) => {
			console.log(eachpost);
			return (
				<li className='postContainer'>
					<div className='postBox'>{eachpost.description}</div>
					<div className='imgBox'>
						<img src={eachpost.photo} />
						<div className='commentBox'> add comment...</div>
					</div>
				</li>
			);
		});
	};

	return (
		<>
			<div className='showPosts'>{showPosts()}</div>
		</>
	);
}

export default Home;

// description: {
// 	type: String,
// 	trim: true,
// 	default: '',
// },
// photo: {
// 	type: String,
// 	required: 'Please select image',
// },
// createdAt: {
// 	type: Date,
// 	default: Date.now,
// },
// author: {
// 	type: mongoose.Schema.ObjectId,
// 	ref: 'User',
// 	required: true,
// },
// hashtags: {
// 	type: Array,
// 	default: [],
// },
// tags: {
// 	type: Array,
// 	default: [],
// },
// location: {
// 	type: {
// 		type: String,
// 		enum: ['Point'],
// 	},
// 	coordinates: { type: [], default: undefined },
// 	address: {
// 		type: String,
// 	},
// },
// })

// postSchema.index({ location: '2dsphere' })

// module.exports = mongoose.model('Post', postSchema)
