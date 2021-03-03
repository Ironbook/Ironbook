import React, { useState } from 'react';
import actions from '../api'

function AddPost(props) {

    let [post, setPost] = useState('')

    const handleSubmit = (event) => {
        //Send it to the server! 
        event.preventDefault()

        actions.addPost(post)
            .then(newPost => {
                console.log('new post!', newPost)
                //Redirect to all-posts page
                props.history.push(`all-posts`)
            }).catch(console.error)
    }

    const handleChange = (event) => {
        //On typing setPost 
        setPost(event.target.value)
    }

    return (
        <>
            <h3>Make a AddPost</h3>

            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} type="text" name="post" placeholder="Make a post..." />
                <button>📬</button>
            </form>

        </>
    );
}

export default AddPost;