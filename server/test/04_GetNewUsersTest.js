const expect = require('chai').expect
const request = require('supertest')
const { app } = require('../server')
const User = require('../models/Users')
const dbHandler = require('./db-handler')
const { getUser, populate } = require('./data/users')

describe('/api/users/getNewUsers', () => {
	let userId
	before('getting _id', async () => {
		await dbHandler.clearDatabase()
		await populate(getUser(1))
		const { _id } = await User.findOne({
			username: getUser(1).username,
		}).select('_id')
		userId = _id
	})

	it('should return new users', (done) => {
		request(app)
			.post('/api/users/getNewUsers')
			.send({ initialFetch: true })
			.expect(200)
			.then((res) => {
				expect(res.body).to.have.all.keys('usersCount', 'users')
				expect(res.body.users).to.be.an('array')
				expect(res.body.users).to.have.lengthOf(3)
				expect(res.body).to.have.nested.property('users[0]._id')
				expect(res.body).to.have.nested.property(
					'users[0].profilePicture'
				)
				expect(res.body).to.have.nested.property('users[0].username')
				done()
			})
			.catch((err) => done(err))
	})

	it('should require lastId if initialFetch is false', (done) => {
		request(app)
			.post('/api/users/getNewUsers')
			.send({ initialFetch: false })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.all.keys('message')
				expect(res.body.message).to.equal('"lastId" is required')
				done()
			})
			.catch((err) => done(err))
	})
	it('should return user after first one', (done) => {
		request(app)
			.post('/api/users/getNewUsers')
			.send({ initialFetch: false, lastId: userId })
			.expect(200)
			.then((res) => {
				expect(res.body).to.have.all.keys('users')
				expect(res.body.users).to.be.an('array')
				expect(res.body.users).to.have.lengthOf(1)
				expect(res.body).to.have.nested.property('users[0]._id')
				expect(res.body).to.have.nested.property('users[0].date')
				expect(res.body).to.have.nested.property(
					'users[0].profilePicture'
				)
				expect(res.body).to.have.nested.property('users[0].username')
				done()
			})
			.catch((err) => done(err))
	})
})
