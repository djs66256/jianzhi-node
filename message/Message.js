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
};

Message.prototype.setFromUser = function (fromUser) {
	this.from_user = fromUser;
};

Message.prototype.setToUser = function (toUser) {
	this.to_user = toUser;
};

Message.prototype.setType = function (type) {
	this.type = type;
};

Message.prototype.setText = function (text) {
	this.text = text;
};

Message.prototype.setUuid = function (uuid) {
	this.uuid = uuid;
};

Message.prototype.setJob = function (job) {
	this.job = job;
};

Message.prototype.setNameCard = function (nameCard) {
	this.name_card = nameCard;
};


Message.MESSAGE = 1;
Message.LOGIN 	= 2;
Message.LOGOUT 	= 3;



module.exports = Message;