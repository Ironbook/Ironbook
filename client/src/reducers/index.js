import { combineReducers } from 'redux'

import { alert } from './alertReducer'
import { authentication } from './authenticationReducer'
import { chat } from './chatReducer'
import { comment } from './commentReducer'
import { replies } from './commentRepliesReducer'
import { newUsers } from './newUsersReducer'
import { notification } from './notificationReducer'
import { passwordReset } from './passwordResetReducer'
import { post } from './postReducer'
import { postUpload } from './postUploadPageReducer'
import { registration } from './registrationReducer'
import { socket } from './socketReducer'
import { userProfile } from './userProfileReducer'
import { user } from './userReducer'

import { userConstants } from '../constants/userConstants'

const appReducer = combineReducers({
	// alert,
	// authentication,
	// chat,
	// comment,
	// replies,
	// newUsers,
	// notification,
	// passwordReset,
	// post,
	// postUpload,
	// registration
	// socket,
	// userProfile,
	// user,
})

const rootReducer = (state, action) => {
	if (action.type === userConstants.LOGOUT) {
		state = undefined
	}
	return appReducer(state, action)
}

export default rootReducer
