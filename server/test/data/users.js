const User = require('../../models/Users')
const Following = require('../../models/Following')
const Followers = require('../../models/Followers')
const bcrypt = require('bcryptjs')

function getUser(idx) {
	const data = [
		{
			firstName: 'Steel',
			lastName: 'Doe',
			username: 'Steelman',
			email: 'john@doe.com',
			password: 'hunter2',
			retypepassword: 'hunter2',
		},
		{
			firstName: 'Iron',
			lastName: 'Doe',
			username: 'Irongirl',
			email: 'jane@doe.com',
			password: 'hunter2',
			retypepassword: 'hunter2',
		},
		{
			firstName: 'Metal',
			lastName: 'Foe',
			username: 'Firongirl',
			email: 'larry@moe.com',
			password: 'hunter3',
			retypepassword: 'hunter3',
		},
		{
			firstName: 'FullMetal',
			lastName: 'Shinigami',
			username: 'Fanboi',
			email: 'kawaii@anime.com',
			password: 'hunter4',
			retypepassword: 'hunter4',
		},
	]
	return data[idx]
}
let randomUsers
async function randoms() {
	try {
		randomUsers = await Promise.all([
			createUser(getUser(2)),
			createUser(getUser(3)),
		])
	} catch (err) {
		return randomUsers
	}
	return randomUsers
}

async function populate(userData) {
	const [{ user: user2 }, { user: user3 }] = await randoms()
	const { user, following, followers } = await createUser(userData)
	following.following.push({ user: user2._id }, { user: user3._id })
	followers.followers.push({ user: user2._id }, { user: user3._id })
	await Promise.all([following.save(), followers.save()])
	return user
}

async function createUser(userData) {
	const hash = bcrypt.hashSync(userData.password, 10)
	const user = await new User({
		...userData,
		activated: false,
		password: hash,
	}).save()
	const following = await new Following({
		user: user._id,
		following: [],
	}).save()
	const followers = await new Followers({
		user: user._id,
		followers: [],
	}).save()
	return { user, following, followers }
}

module.exports = {
	getUser,
	populate,
}
