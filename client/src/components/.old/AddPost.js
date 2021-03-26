// import React, { useState } from 'react';
// import { addPost } from '../actions/postActions';
// import SearchBar from './SearchBar';

// function newPost(props) {
// 	let [post, setPost] = useState('');

// 	const handleSubmit = (event) => {
// 		//Send it to the server!
// 		event.preventDefault();

// 		addPost(post)
// 			.then((newPost) => {
// 				console.log('new post!', newPost);
// 				//Redirect to all-posts page
// 				props.history.push(`all-posts`);
// 			})
// 			.catch(console.error);
// 	};

// 	const handleChange = (event) => {
// 		//On typing setPost
// 		setPost(event.target.value);
// 	};

// 	return (
// 		<div>
// 			<h3>Make a AddPost</h3>
// 			<SearchBar />
// 			<form onSubmit={handleSubmit}>
// 				<input
// 					onChange={handleChange}
// 					type='text'
// 					name='post'
// 					placeholder='Make a post...'
// 				/>
// 				<button>📬</button>
// 			</form>
// 		</div>
// 	);
// }

// export default AddPost;
