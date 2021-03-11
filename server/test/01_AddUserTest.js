const expect = require('chai').expect
const supertest = require('supertest')
const { app } = require('../server')
const dbHandler = require('./db-handler')
const { getUser, populate } = require('./data/users')
const User = require('../models/Users')
const Followers = require('../models/Followers')
const Following = require('../models/Following')

let server, agent

beforeEach(async () => {
	await dbHandler.clearDatabase()
	await populate(getUser(1))
})

beforeEach((done) => {
	server = app.listen(4000, (err) => {
		if (err) return done(err)
		agent = supertest(server) // since the application is already listening, it should use the allocated port
		done()
	})
})

afterEach((done) => server.close(done))

after(async () => {
	await dbHandler.clearDatabase()
	await dbHandler.closeDatabase()
})

describe('/api/users/signup', () => {
	it('should create user', (done) => {
		const user = { ...getUser(0), username: 'testuser' }
		agent
			.post('/api/users/signup')
			.send(user)
			.then((res) => {
				expect(res.body).to.have.property('message')
				if (process.env.ENABLE_SEND_EMAIL === 'true') {
					expect(res.body.message).to.equal(
						'Verify your email address'
					)
				} else {
					expect(res.body.message).to.equal('Account created')
				}
				done()
			})
			.catch((err) => done(err))
	})

	it('check if documents in collections are created', async () => {
		await agent.post('/api/users/signup').send(getUser(0))
		const users = await User.find({ email: getUser(0).email })
		const [user] = users
		expect(users, 'only one user should be created').to.have.lengthOf(1)
		const a = await Following.find({ user: user._id })
		const b = await Followers.find({ user: user._id })
		const documents = await Promise.all([a, b])
		const [following, followers] = documents
		const userId = user._id.toString()
		const followingUserId = following[0].user.toString()
		const followerUserId = followers[0].user.toString()

		expect(
			following,
			'one document in Followers should be created'
		).to.have.lengthOf(1)
		expect(followingUserId).to.equal(userId)

		expect(
			followers,
			'one document in Followers should be created'
		).to.have.lengthOf(1)
		expect(followerUserId).to.equal(userId)
	})

	it('should not create user if username exists', async () => {
		const user = getUser(1)
		await agent.post('/api/users/signup').send(user)
		await agent
			.post('/api/users/signup')
			.send({ ...user, email: 'doesnotexist@gmail.com' })
			.expect(409)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('username exists')
			})
	})

	it('should not create user if email exists', (done) => {
		const user = { ...getUser(1), username: 'johnnymac' }
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(409)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('Email exists')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if username is invalid', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, username: 'john doe' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if username is invalid', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, username: 'john@doe' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if email is invalid', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, email: 'janedoe.com' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if email is invalid', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, email: 'janedoe@com' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if email is invalid', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, email: 'janedoecom' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user without firstName', (done) => {
		const user = { ...getUser(0) }
		delete user.firstName
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('"firstName" is required')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user without lastName', (done) => {
		const user = { ...getUser(0) }
		delete user.lastName
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('"lastName" is required')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user without username', (done) => {
		const user = { ...getUser(0) }
		delete user.username
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('"username" is required')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user without email', (done) => {
		const user = { ...getUser(0) }
		delete user.email
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('"email" is required')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user without password', (done) => {
		const user = { ...getUser(0) }
		delete user.password
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('"password" is required')
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user without retypepassword', (done) => {
		const user = { ...getUser(0) }
		delete user.retypepassword
		agent
			.post('/api/users/signup')
			.send(user)
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"retypepassword" is required'
				)
				done()
			})
			.catch((err) => done(err))
	})

	// tests with empty fileds

	it('should not create user if firstname is empty', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, firstName: '' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"firstName" is not allowed to be empty'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if lastname is empty', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, lastName: '' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"lastName" is not allowed to be empty'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if username is empty', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, username: '' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"username" is not allowed to be empty'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if email is empty', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, email: '' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"email" is not allowed to be empty'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if password is empty', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, password: '' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"password" is not allowed to be empty'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if retypepassword is empty', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, retypepassword: '' })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"retypepassword" must be [ref:password]'
				)
				done()
			})
			.catch((err) => done(err))
	})

	// tests with too long values

	it('should not create user if firstname is too long', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, firstName: 'a'.repeat(31) })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"firstName" length must be less than or equal to 30 characters long'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if lastname is too long', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, lastName: 'a'.repeat(31) })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"lastName" length must be less than or equal to 30 characters long'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if username is too long', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, username: 'a'.repeat(31) })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"username" length must be less than or equal to 30 characters long'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if email is too long', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, email: 'a'.repeat(31) })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"email" length must be less than or equal to 30 characters long'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if password is too long', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, password: 'a'.repeat(31) })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"password" length must be less than or equal to 30 characters long'
				)
				done()
			})
			.catch((err) => done(err))
	})

	it('should not create user if retypepassword is too long', (done) => {
		const user = { ...getUser(0) }
		agent
			.post('/api/users/signup')
			.send({ ...user, retypepassword: 'a'.repeat(31) })
			.expect(400)
			.then((res) => {
				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal(
					'"retypepassword" must be [ref:password]'
				)
				done()
			})
			.catch((err) => done(err))
	})
})
