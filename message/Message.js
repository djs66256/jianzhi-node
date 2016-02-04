/**
 * New node file
 */

var UserManager = require('./UserManager');

function Message(json, sock) {
	if (json.uid) {
		var content = json.content;
		
	}
	else if (json.gid) {
		
	}
}

Message.MESSAGE = 1;
Message.LOGIN 	= 2;
Message.LOGOUT 	= 3;

Message.prototype.handle = function() {
	
}

module.exports = Message;