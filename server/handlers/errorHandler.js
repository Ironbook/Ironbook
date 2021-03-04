// Catch Errors Handler so we don't need to write this over and over.

exports.catchErrors = (fn) => {
	return function (req, res, next) {
		return fn(req, res, next).catch(next)
	}
}
