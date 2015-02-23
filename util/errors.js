var error = require('subclass-error');

var errors = {
	HTTPErrors: {
		ClientError: error("ClientError", { statusCode: 400 }),
		ServerError: error("ServerError", { statusCode: 500 }),
		ForbiddenError: error("ForbiddenError", { statusCode: 403 }),
		NotAuthorizedError: error("NotAuthorizedError", {statusCode: 401})
	}
}
module.exports = errors;
