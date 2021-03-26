import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles, withTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import logo from '../images/logo.svg'
import { Switch } from 'react-router'
import SearchBar from './SearchBar'
import { postService } from '../services/postService'

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='https://material-ui.com/'>
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	)
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}))

const NewPost = () => {
	const classes = useStyles()

	return (
		<div className='flexBox'>
			<div className='signBox'>
				<Container component='main' maxWidth='xs'>
					<CssBaseline />
					<div className={classes.paper}>
						<img src={logo} />
						<Typography component='h1' variant='h5'>
							<h1
								style={{
									fontSize: '32px',
									textAlign: 'center',
									color: '#2F354A',
								}}
							>
								Stay in touch with your fellow Ironhackers!
							</h1>
						</Typography>
						<form className={classes.form} noValidate onSubmit={clickSubmit}>
							<TextField
								variant='outlined'
								margin='normal'
								required
								fullWidth
								id='firstNmae'
								label='First Name'
								name='First Name'
								autoComplete='First Name'
								onChange={(e) => setFirstName(e.target.value)}
								autoFocus
							/>
							<TextField
								variant='outlined'
								margin='normal'
								required
								fullWidth
								id='Last Name'
								label='Last Name'
								name='Last Name'
								autoComplete='Last Name'
								onChange={(e) => setLastName(e.target.value)}
								autoFocus
							/>
							<Button
								style={{ backgroundColor: '#2DC5FA' }}
								type='submit'
								fullWidth
								variant='contained'
								color='primary'
								className={classes.submit}
							>
								Sign Up
							</Button>

							<Grid container>
								<Grid item xs>
									<Link style={{ color: '#7F8390' }} href='#' variant='body2'>
										Forgot password?
									</Link>
								</Grid>
								{/* <Grid item>
									<Link style={{ color: '#7F8390' }} href='#' variant='body2'>
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid> */}
							</Grid>
						</form>
					</div>
					<Box mt={8}>{/* <Copyright /> */}</Box>
				</Container>
			</div>
		</div>
	)
}
export default NewPost
