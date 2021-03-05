const express = require('express')
const router = express.Router()

router.use('/api', require('./api'))
router.use('/auth', require('./auth'))
router.use('/comment', require('./comment'))
router.use('/post', require('./post'))

module.exports = router
