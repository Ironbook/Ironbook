const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const checkAuth = require('../middleware/checkAuth')
const chatValidator = require('../middleware/validators/chatValidator')
const checkRoom = require('../middleware/checkRoom')

router.post('/getChatRooms/', checkAuth, chatController.getChatRooms)

router.post(
	'/getMessagesForRoom',
	checkAuth,
	chatValidator.getMessagesForRoom,
	chatController.getMessagesForRoom
)

router.post(
	'/sendImage',
	checkAuth,
	chatController.upload,
	chatValidator.sendImage,
	checkRoom,
	chatController.createImageMessage
)

router.post(
	'/call',
	checkAuth,
	chatValidator.handleCall,
	checkRoom,
	chatController.handleCall
)

router.post(
	'/answer',
	checkAuth,
	chatValidator.answer,
	checkRoom,
	chatController.answer
)

router.post(
	'/sendMessage',
	checkAuth,
	chatValidator.sendMessage,
	checkRoom,
	chatController.sendMessage
)

router.post(
	'/readMessages',
	checkAuth,
	chatValidator.readMessages,
	checkRoom,
	chatController.readMessages
)

module.exports = router
