const expect = require('chai').expect
const request = require('supertest')
const jwt = require('jsonwebtoken')
const { app } = require('../server')
const { getUser, populate } = require('./data/users')
const User = require('../models/Users')
const dbHandler = require('./db-handler')

describe('/api/users/getUserData', () => {
	let tokenJWT
	before(async () => {
		await dbHandler.clearDatabase()
		await populate(getUser(0))
		await populate(getUser(1))
		const { username, email } = getUser(1)
		const token = jwt.sign(
			{
				email: email,
				userId: await User.findOne({ email }).select('_id'),
				username: username,
			},
			process.env.JWT_KEY,
			{ expiresIn: '30m' }
		)
		tokenJWT = 'Bearer ' + token
	})

	it('should return user data if jwt is passed and profilePage parameters is true', (done) => {
		request(app)
			.post('/api/users/getUserData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: true, userProfile: false })
			.expect(200)
			.then((res) => {
				expect(res.body.user).to.have.all.keys(
					'_id',
					'firstName',
					'lastName',
					'username',
					'email',
					'bio',
					'profilePicture',
					'followings',
					'followers',
					'followingIds',
					'postLikes',
					'commentLikes',
					'commentReplyLikes',
					'allNotifications',
					'messagesCount',
					'notificationsCount',
					'posts',
					'postsCount'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should return user data if jwt is passed and userProfile parameters is true', (done) => {
		request(app)
			.post('/api/users/getUserData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: false, userProfile: true })
			.expect(200)
			.then((res) => {
				expect(res.body.user).to.have.all.keys(
					'_id',
					'firstName',
					'lastName',
					'username',
					'profilePicture',
					'followingIds',
					'postLikes',
					'commentLikes',
					'commentReplyLikes',
					'allNotifications',
					'messagesCount',
					'notificationsCount',
					'postsCount'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not return user data if parameters are not passed', (done) => {
		request(app)
			.post('/api/users/getUserData')
			.set('Authorization', tokenJWT)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('"profilePage" is required')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not return user data if profilePage is not boolean', (done) => {
		request(app)
			.post('/api/users/getUserData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: 'asd', userProfile: 'asd' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal(
					'"profilePage" must be a boolean'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not return user data if userProfile is not boolean', (done) => {
		request(app)
			.post('/api/users/getUserData')
			.set('Authorization', tokenJWT)
			.send({ profilePage: true, userProfile: 'asd' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal(
					'"userProfile" must be a boolean'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not return user data if jwt is not passed', (done) => {
		request(app)
			.post('/api/users/getUserData')
			.send({ initialFetch: true })
			.expect(401)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('Invalid token')
				done()
			})
			.catch((err) => done(err))
	})
})
