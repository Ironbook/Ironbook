import { useEffect, useState } from 'react';
import actions from './api';
import { Switch, Route, Link } from 'react-router-dom';
import background from './images/NewBackground.svg';

//Material UI

// Components
import Home from './components/Home';
import NewPost from './components/NewPost';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import Logo from './components/Logo';
// import SearchBar from './components/SearchBar';
import Messages from './components/Messages';
import Notifications from './components/Notifications';

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
		<div
			className='App'
			style={{
				backgroundImage: `url(${background})`,
				backgroundAttachment: 'fixed',
			}}
		>
			{/* <SearchBar /> */}
			<Switch>
				<Route exact path='/' render={(props) => <Home {...props} />} />

				<Route
					exact
					path='/NewPost'
					render={(props) => <NewPost {...props} />}
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
				<Route
					exact
					path='/messages'
					render={(props) => <Messages {...props} />}
				/>
				<Route
					exact
					path='/notifications'
					render={(props) => <Notifications {...props} />}
				/>
			</Switch>
		</div>
	);
}

export default App;
