import React, { useEffect, useState } from 'react';
import actions from '../api'


function AllPosts(props) {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        actions.getAllPosts().then((allPosts) => {
            setPosts(allPosts.data)
        }).catch(console.error)

    }, [])


    const showPosts = () => {
        return posts.map(post => {
            return (
                <li key={post._id}>{post.post}</li>
            )
        })
    }


    return (
        <>
            <h3>All Posts</h3>
            <ul>{showPosts()}</ul>

        </>
    );
}

export default AllPosts;