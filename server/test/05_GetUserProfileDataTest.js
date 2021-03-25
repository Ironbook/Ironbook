const expect = require('chai').expect
const request = require('supertest')
const jwt = require('jsonwebtoken')
const { app } = require('../server')
const { getUser, populate } = require('./data/users')
const User = require('../models/Users')
const dbHandler = require('./db-handler')

describe('/api/users/getUserProfileData', () => {
	let tokenJWT
	before(async () => {
		await dbHandler.clearDatabase()
		await populate(getUser(1))
		await populate(getUser(0))
		const { username, email } = getUser(1)
		const { _id } = await User.findOne({ email }).select('_id')
		const token = jwt.sign(
			{
				email: email,
				userId: _id,
				username: username,
			},
			process.env.JWT_KEY,
			{ expiresIn: '30m' }
		)
		tokenJWT = 'Bearer ' + token
	})

	it('should return data if jwt is passed and profilePage parameters is true', (done) => {
		request(app)
			.post('/api/users/getProfilePageData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: true, username: getUser(0).username })
			.expect(200)
			.then((res) => {
				expect(res.body).to.have.all.keys(
					'_id',
					'bio',
					'firstName',
					'followers',
					'followings',
					'lastName',
					'posts',
					'postsCount',
					'profilePicture',
					'username'
				)
				done()
			})
			.catch((err) => done(err))
	})
	it('should return if user requests its profile', (done) => {
		const user = getUser(1)
		request(app)
			.post('/api/users/getProfilePageData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: true, username: user.username })
			.expect(200)
			.then((res) => {
				expect(res.body.user).to.have.all.keys('loggedInUser')
				done()
			})
			.catch((err) => done(err))
	})
	it('should not return if jwt not passed', (done) => {
		const user = {
			...getUser(0),
		}
		request(app)
			.post('/api/users/getProfilePageData')
			.send({ profilePage: true, username: user.username })
			.expect(401)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('Invalid token')
				done()
			})
			.catch((err) => done(err))
	})
	it('should not return if username not passed', (done) => {
		request(app)
			.post('/api/users/getProfilePageData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: true })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('"username" is required')
				done()
			})
			.catch((err) => done(err))
	})
	it('should not return if username not valid', (done) => {
		request(app)
			.post('/api/users/getProfilePageData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: true, username: '123123' })
			.expect(404)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('User not found')
				done()
			})
			.catch((err) => done(err))
	})
})
