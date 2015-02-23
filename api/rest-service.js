var Factory = {};

Factory.sendData = function (req, res, customStatus) {
	return function (data) {
		res.status(customStatus || 200)
       	   .send(data);
	};
};

Factory.sendDocument = function (req, res) {
	return function (document) {
		res.status(document.status)
		   .send(document.body);
		return;
	};
};
 
Factory.sendError = function (req, res) {
	return function (error) {
		res.status(error.statusCode || 500)
		   .send(error.message);
		return;
	};
};

module.exports = {
	Factory: Factory
};