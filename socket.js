/**
 * New node file
 */
//var Message = require('./message/Message');
var UserManager = require('./message/UserManager');
var MessageManager = require('./message/MessageManager');

var tokenService = require('./core/Token/TokenService');
var messageService = require('./core/Message/MessageService');
var jobService = require('./core/Job/JobService');
var userService = require('./core/User/UserService');
var Message = require('./core/Message/Message');

module.exports = function(io) {
	UserManager.io = io;
	
	io.on('connect', function(sock) {

		var tokeString = sock.handshake.headers.cookie;
		var token = tokenFromString(tokeString);
		if (token && token.uid != null && token.token != null) {
			tokenService.validate(token.token, token.uid, function(success) {
				if (success) {
                    UserManager.login(token.token, token.uid, sock.id, function() {
                        console.log("Login: "+token.uid);
                    });
					sock.emit("login");

                    messageService.findUndownloadedByFromUser(token.uid, function(error, rows) {
                        var data = [];
                        rows.forEach(function(row) {
                            var message = {
                                time: row.time.getTime(),
                                uid: row.from_user,
                                uuid: row.uuid,
                                type: row.type,
                                text: row.text
                            };
                            data.push(message)
                        });
                        if (data.length > 0) {
                            sock.emit("message", data, function(ack) {
                                if (ack == 'ok') {
                                    data.forEach(function(row) {
                                        messageService.setDownloadedByUuid(row.uuid, function () {
                                        });
                                    });
                                }
                            })
                        }
                    })
				}
				else {
					sock.emit("needlogin", "need login");
				}
			})
		}
		else {
			sock.emit("needlogin", "need login");
		}

		sock.on('message', function(data, ack) {
			var user = UserManager.findBySockid(sock.id);
			if (!user) {
                if (ack) ack('error');
				sock.emit('needlogin', {});
				return;
			}
			
			if (data.uid) {
                var msg = {
                    from_user: user.uid,
                    to_user: data.uid,
                    type: data.type,
                    text: data.text,
                    uuid: data.uuid,
                    jid: data.jid,
                    cid: data.cid
                };
                MessageManager.parse(msg, function(err, message) {
                    if (err) {
                        if (ack) ack('error');
                    }
                    else {
                        var sendMessage = message.getSendMessage();
                        UserManager.findSocksByUid(message.to_user).forEach(function (sock) {
                            sock.emit('message', sendMessage, function (data) {
                                if (data == 'ok') {
                                    messageService.setDownloadedByUuid(message.uuid, function () {
                                    });
                                }
                            })
                        });
                        if (ack) ack('ok');
                    }
                });
			}
            else {
                if (ack) ack('error');
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
	var token = {uid:null, token:null};
	var tokens = str.split(';');
	tokens.every(function(i, index) {
		var kv = i.split('=');
		if (kv.length == 2) {
			token[kv[0].trim()] = kv[1].trim();
		}
		return true
	});
    if (token.uid && token.token) {
        if (typeof token.uid == "string") {
            token.uid = parseInt(token.uid);
        }
        return token;
    }
    return null;
}
