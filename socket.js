/**
 * New node file
 */
var Message = require('./message/Message');
var UserManager = require('./message/UserManager');

var tokenService = require('./core/Token/TokenService');

module.exports = function(io) {
	UserManager.io = io;
	
	io.on('connect', function(sock) {

		var tokeString = sock.handshake.headers.cookie;
		var token = tokenFromString(tokeString);
		if (token.uid && token.token) {
			tokenService.validate(token.token, token.uid, function(success) {
				if (success) {
					sock.emit("login")
				}
				else {
					sock.emit("needlogin", "need login");
				}
			})
		}
		else {
			sock.emit("needlogin", "need login");
		}

		// Listeners
		sock.on('login', function(data) {
			if (data.token && data.uid) {
				UserManager.login(data.token, data.uid, sock.id, function(){
					console.log('login:'+data.uid);
				});
			}
		});
		
		sock.on('message', function(data) {
			var user = UserManager.findBySockid(sock.id);
			if (!user) {
				sock.emit('login', {});
				return;
			}
			
			if (data.uid) {
				UserManager.sendToUsers(user, data.uid, data.content, function() {
					
				});
			}
		});
		
		sock.on('logout', function(data) {
			UserManager.logout(sock.id);
		});
		
		sock.on('disconnect', function(data) {
			UserManager.logout(sock.id);
		});
	});
	
};

function tokenFromString(str) {
	if (!str) {
		return null
	}
	var token = {};
	var tokens = str.split(';');
	tokens.every(function(i, index) {
		var kv = i.split('=');
		if (kv.length == 2) {
			token[kv[0]] = kv[1];
		}
		return true
	});
	return token;
}
