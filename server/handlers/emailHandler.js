const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

exports.sendVerificationEmail = (data) => {
	const { email, _id, username } = data
	const token = jwt.sign(
		{
			email,
			_id,
		},
		process.env.JWT_KEY,
		{ expiresIn: '60m' }
	)

	// Config for new user email
	const config = {
		mailserver: {
			service: 'gmail',
			auth: {
				user: process.env.EMAILUSER,
				pass: process.env.EMAILPASS,
			},
		},
		mail: {
			from: process.env.EMAILUSER,
			to: email,
			subject: 'Ironbook Account Verification',
			template: 'verify',
			context: {
				token,
				username,
				host: process.env.HOST,
			},
		},
	}

	const sendMail = async ({ mailserver, mail }) => {
		let transporter = nodemailer.createTransport(mailserver)
		transporter.use(
			'compile',
			hbs({
				viewEngine: {
					partialsDir: './emails/',
					defaultLayout: '',
				},
				viewPath: './emails/',
				extName: '.hbs',
			})
		)
		await transporter.sendMail(mail)
	}

	sendMail(config).catch((err) => console.log(err))
}

exports.sendPasswordResetEmail = (data) => {
	const { email, _id, username } = data
	console.log('sending email')
	const token = jwt.sign(
		{
			email,
			_id,
		},
		process.env.JWT_KEY,
		{
			expiresIn: '10m',
		}
	)

	// Config for password reset email
	const config = {
		mailserver: {
			service: 'gmail',
			auth: {
				user: process.env.EMAILUSER,
				pass: process.env.EMAILPASS,
			},
		},
		mail: {
			from: process.env.EMAILUSER,
			to: email,
			subject: 'Password reset',
			template: 'passwordReset',
			context: {
				token,
				username,
				host: process.env.HOST,
			},
		},
	}

	const sendMail = async ({ mailserver, mail }) => {
		let transporter = nodemailer.createTransport(mailserver)

		transporter.use(
			'compile',
			hbs({
				viewEngine: {
					partialsDir: './emails/',
					defaultLayout: '',
				},
				viewPath: './emails/',
				extName: '.hbs',
			})
		)
		await transporter.sendMail(mail)
	}

	sendMail(config).catch((err) => console.log(err))
}
