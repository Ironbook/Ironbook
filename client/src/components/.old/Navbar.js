import React from 'react'
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

const Navbar = () => {
	return (
		<div className=''>
			<AppBar position='static'>
				<Toolbar>
					<IconButton className='' color='inherit' aria-label='Menu'>
						Button!
					</IconButton>
					<Typography className='' variant='title' color='inherit'>
						<Link className='' to='/'>
							Ironbook
						</Link>
					</Typography>
					<div>Second Div? Filler!</div>
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default Navbar
