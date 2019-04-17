var handler = {};

var defaultMessage = {
	401: "401 Unauthorized",
	404: "404 Not Found",
	500: "500 Internal Server Error"
}

function processResponse(response, statusCode, body) {
	response.status(statusCode);
	if (typeof(body) === 'object') {
		return response.json(body);
	}
	else {
		if (statusCode == 200) {
			return response.json({ response: body })
		}
		else {
			return response.json({ error: true, response: (body || defaultMessage[statusCode]) })
		}
	}

}

handler.Ok = function(response, body) {
	processResponse(response, 200, body);
}

handler.Unauthorized = function(response, body) {
	processResponse(response, 401, body);
}

handler.NotFound = function(response, body) {
	processResponse(response, 404, body);
}

handler.InternalServerError = function(response, body) {
	processResponse(response, 500, body);
}


module.exports = handler;