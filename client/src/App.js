import { useEffect, useState } from 'react';
import actions from './api';
import { Switch, Route, Link } from 'react-router-dom';
import background from './images/background-shape.svg';

//Material UI

// Components
import Home from './components/Home';
import AddPost from './components/AddPost';
import AllPosts from './components/AllPosts';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import Logo from './components/Logo';
import SearchBar from './components/SearchBar';

function App() {
	const [user, setUser] = useState({});

	useEffect(() => {
		actions
			.getUser()
			.then((res) => {
				setUser(res.data);
			})
			.catch(console.error);
	}, []);

	return (
		<div className='App' style={{ backgroundImage: `url(${background})` }}>
			<SearchBar />
			<h4>{user.email}</h4>
			<nav>
				<Link to='/'>Home</Link>
				<Link to='SignUp'>Sign Up</Link>
			</nav>

			<Switch>
				<Route exact path='/' render={(props) => <Home {...props} />} />
				<Route
					exact
					path='/all-posts'
					render={(props) => <AllPosts {...props} />}
				/>
				<Route
					exact
					path='/add-posts'
					render={(props) => <AddPost {...props} />}
				/>
				<Route
					exact
					path='/auth'
					render={(props) => <Auth setUser={setUser} {...props} />}
				/>
				<Route
					exact
					path='/profile'
					render={(props) => <Profile user={user} {...props} />}
				/>
				<Route exact path='/SignUp' render={(props) => <SignUp {...props} />} />
			</Switch>
		</div>
	);
}

export default App;
