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
	]
	return data[idx]
}

async function populate() {
	const user = {
		...getUser(1),
	}
	await bcrypt.hash(user.password, 10, async (err, hash) => {
		if (err) {
			console.log(err)
			return
		}
		const user = new User({
			...getUser(1),
			activated: false,
			password: hash,
		})
		await user.save().then((user) => {
			new Following({ user: user._id }).save()
			new Followers({ user: user._id }).save()
		})
	})
}

module.exports = {
	getUser,
	populate,
}
