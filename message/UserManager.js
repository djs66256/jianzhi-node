/**
 * New node file
 */
var User = require('./User');

function UserManager() {
	this.dict = {};
	this.io = null;
}

UserManager.prototype.login = function (token, uid, sockid, callback) {
	var user = new User(token, uid, sockid);
	this.dict[sockid] = user;
	if (callback) {
		callback();
	}
};

UserManager.prototype.logout = function(sockid, callback) {
	var user = this.findBySockid(sockid);
	if (user) {
		delete this.dict[sockid];
		if (callback) {
			callback();
		}
	}
	else {
		if (callback) {
			callback('already logout');
		}
	}
};

UserManager.prototype.findBySockid = function (sockid) {
	return this.dict[sockid];
};

UserManager.prototype.findSocksByUser = function (users) {
	var socks = [];
	var connections = this.io.sockets.connected;
	users.forEach(function (user) {
		var sock = connections[user.sockid];
		if (sock) {
			socks.push(sock)
		}
	});
	return socks;
};

UserManager.prototype.findSocksByUid = function (uid) {
	var user = this.findByUid(uid);
	if (user) {
		return this.findSocksByUser(user);
	}
	else {
		return null;
	}
};

UserManager.prototype.findByUid = function (uid) {
	var list = [];
	for (var key in this.dict) {
		if (this.dict[key].uid == uid) {
			list.push(this.dict[key]);
		}
	}
	return list;
};

//UserManager.prototype.sendToUsers = function(uid, message, callback) {
//	var list = this.findByUid(uid);
//	for (var i=0; i<list.length; i++) {
//		var sockid = list[i].sockid;
//		var data = {uid: user.uid, content: content};
//		this.io.sockets.connected[sockid].emit('message', data);
//	}
//};

module.exports = new UserManager();