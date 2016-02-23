/**
 * New node file
 */
//var Message = require('./message/Message');
var UserManager = require('./message/UserManager');

var tokenService = require('./core/Token/TokenService');
var messageService = require('./core/Message/MessageService');
var jobService = require('./core/Job/JobService');
var Message = require('./core/Message/Message');

module.exports = function(io) {
	UserManager.io = io;
	
	io.on('connect', function(sock) {

		var tokeString = sock.handshake.headers.cookie;
		var token = tokenFromString(tokeString);
		if (token.uid != null && token.token != null) {
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
                            sock.emit("message", data)
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

		// Listeners
		//sock.on('login', function(data) {
		//	if (data.token && data.uid) {
		//		UserManager.login(data.token, data.uid, sock.id, function(){
		//			console.log('login:'+data.uid);
		//		});
		//	}
		//});
		
		sock.on('message', function(data) {
			var user = UserManager.findBySockid(sock.id);
			if (!user) {
				sock.emit('needlogin', {});
				return;
			}
			
			if (data.uid) {
                var msg = new Message();
                msg.from_user = user.uid;
                msg.to_user = data.uid;
                msg.type = data.type;
                msg.text = data.text;
                msg.uuid = data.uuid;
                msg.job = null;
                msg.name_card = null;

                if (data.type == Message.MessageType.Job) {
                    if (data.jid) {
                        jobService.findById(data.jid, function(error, rows) {
                            if (error || rows.length == 0) {
                                sock.emit("messageError", data.uuid)
                            }
                            else {
                                msg.job = data.jid;

                                messageService.insertMessage(msg, function() {
                                    sock.emit("messageAck", data.uuid);
                                    var toUsers = UserManager.findByUid(data.uid);
                                    toUsers.forEach(function(toUser){
                                        var sendMsg = {};
                                        sendMsg.time = msg.time.getTime();
                                        sendMsg.uid = user.uid;
                                        sendMsg.text = msg.text;
                                        sendMsg.type = msg.type;
                                        sendMsg.uuid = msg.uuid;
                                        sendMsg.cid = msg.name_card;
                                        sendMsg.jid = msg.job;
                                        sendMsg.job = rows[0];

                                        io.sockets.connected[toUser.sockid].emit('message', sendMsg);
                                    })
                                });
                            }
                        })
                    }
                    else {
                        return sock.emit("messageError", data.uuid)
                    }
                }
                else {
                    messageService.insertMessage(msg, function() {
                        sock.emit("messageAck", data.uuid);
                        var toUsers = UserManager.findByUid(data.uid);
                        toUsers.forEach(function(toUser){
                            var sendMsg = {};
                            sendMsg.time = msg.time.getTime();
                            sendMsg.uid = user.uid;
                            sendMsg.text = msg.text;
                            sendMsg.type = msg.type;
                            sendMsg.uuid = msg.uuid;
                            sendMsg.cid = msg.name_card;
                            sendMsg.jid = msg.job;

                            io.sockets.connected[toUser.sockid].emit('message', sendMsg);
                        })
                    });
                }



				//UserManager.sendToUsers(user, data.uid, data.content, function() {
				//
				//});
			}
            else {
                sock.emit("messageError", data.uuid)
            }
		});

        sock.on('messageAck', function(data) {
            // TODO: mark downloaded
            if (data instanceof Array) {
                data.forEach(function(uuid) {
                    messageService.setDownloadedByUuid(uuid, function() {});
                })
            }
            else if (typeof(data) == "string") {
                if (data) {
                    messageService.setDownloadedByUuid(data, function () {
                    });
                }
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
