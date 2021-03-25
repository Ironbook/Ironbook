const mongoose = require('mongoose')
const expect = require('chai').expect
const request = require('supertest')
const jwt = require('jsonwebtoken')
const { app } = require('../server')
const { getUser, populate } = require('./data/users')
const User = require('../models/Users')
const Following = require('../models/Following')
const Followers = require('../models/Followers')
const Notification = require('../models/Notification')
const fakeId = mongoose.Types.ObjectId()
const dbHandler = require('./db-handler')

describe('/api/users/getUserProfileData', () => {
	let tokenJWT, userId, userId1
	beforeEach(async () => {
		await dbHandler.clearDatabase()
		const { _id, email, username } = await populate(getUser(0))
		const {
			_id: _id1,
			email: email1,
			username: username1,
		} = await populate(getUser(1))
		const token = jwt.sign(
			{ email, userId: _id, username },
			process.env.JWT_KEY,
			{ expiresIn: '30m' }
		)
		const token1 = jwt.sign(
			{ email: email1, userId: _id1, username: username1 },
			process.env.JWT_KEY,
			{ expiresIn: '30m' }
		)
		tokenJWT = 'Bearer ' + token
		tokenJWT1 = 'Bearer ' + token1
		userId = _id
		userId1 = _id1
	})

	it('should follow', (done) => {
		request(app)
			.post('/api/users/followUser')
			.set('Authorization', tokenJWT)
			.send({ userId: userId1 })
			.expect(200)
			.then((res) => {
				expect(res.body).to.have.all.keys('userId', 'action')
				expect(res.body.action).to.equal('followed')
				done()
			})
			.catch((err) => done(err))
	})
	it('should not follow itself', (done) => {
		request(app)
			.post('/api/users/followUser')
			.set('Authorization', tokenJWT)
			.send({ userId })
			.expect(403)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('Failed to follow')
				done()
			})
			.catch((err) => done(err))
	})
	it('should modify right documents when followed', async () => {
		const docF = await Following.findOne({ user: userId1 })
		expect(docF.following).to.have.lengthOf(2)
		const docN = await Notification.findOne({ receiver: userId })
		expect(docN.sender.toString()).to.equal(userId1.toString())
		expect(docN.receiver.toString()).to.equal(userId.toString())
		expect(docN.type).to.equal('follow')
		const docFo = await Followers.findOne({ user: userId })
		expect(docFo.followers).to.have.lengthOf(2)
		expect(docFo.followers[0].user.toString()).to.have.equal(
			userId1.toString()
		)
	})
	it('should get followers of user 1', (done) => {
		const { username } = getUser(2)
		request(app)
			.post('/api/users/getUserProfileFollowers')
			.set('Authorization', tokenJWT)
			.send({ userId: userId })
			.expect(200)
			.then((res) => {
				expect(res.body.users[0].followers).to.have.lengthOf(2)
				expect(res.body.users[0].followers[0].user.username).to.equal(
					username
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should get followings of user 1', (done) => {
		request(app)
			.post('/api/users/getUserProfileFollowings')
			.set('Authorization', tokenJWT)
			.send({ userId: userId })
			.expect(200)
			.then((res) => {
				expect(res.body.users[0].following).to.have.lengthOf(2)
				done()
			})
			.catch((err) => done(err))
	})

	it('should get followers of user 2', (done) => {
		request(app)
			.post('/api/users/getUserProfileFollowers')
			.set('Authorization', tokenJWT)
			.send({ userId: userId1 })
			.expect(200)
			.then((res) => {
				expect(res.body.users[0].followers).to.have.lengthOf(2)
				done()
			})
			.catch((err) => done(err))
	})
	it('should get followings of user 2', (done) => {
		const user = {
			...getUser(2),
		}
		request(app)
			.post('/api/users/getUserProfileFollowings')
			.set('Authorization', tokenJWT)
			.send({ userId: userId })
			.expect(200)
			.then((res) => {
				expect(res.body.users[0].following).to.have.lengthOf(2)
				expect(res.body.users[0].following[0].user.username).to.equal(
					user.username
				)
				done()
			})
			.catch((err) => {
				done(err)
			})
	})
	it('should unfollow', (done) => {
		request(app)
			.post('/api/users/followUser')
			.set('Authorization', tokenJWT)
			.send({ userId1 })
			.expect(200)
			.then((res) => {
				expect(res.body).to.have.all.keys('userId', 'action')
				expect(res.body.action).to.equal('unfollowed')
				done()
			})
			.catch((err) => done(err))
	})
	it('should modify right documents when unfollowd', async () => {
		const docF = await Following.findOne({ user: userId1 })
		expect(docF.following).to.have.lengthOf(2)
		const docFo = await Followers.findOne({ user: userId })
		expect(docFo.followers).to.have.lengthOf(2)
	})
	it('should not follow non existing user', (done) => {
		request(app)
			.post('/api/users/followUser')
			.set('Authorization', tokenJWT)
			.send({ userId: fakeId })
			.expect(404)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('User not found')
				done()
			})
			.catch((err) => done(err))
	})
})
