/**
 * New node file
 */
//var Message = require('./message/Message');
var UserManager = require('./message/UserManager');

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
                msg.setFromUser(user.uid);
                msg.setToUser(data.uid);
                msg.setType(data.type);
                msg.setText(data.text);
                msg.setUuid(data.uuid);

                if (msg.type == Message.MessageType.Job) {
                    if (data.jid) {
                        jobService.findById(data.jid, function(error, rows) {
                            if (error || rows.length == 0) {
                                sock.emit("messageError", msg.uuid)
                            }
                            else {
                                //msg.job = data.jid;
                                msg.setJob(rows[0]);

                                messageService.insertMessage(msg, function() {
                                    sock.emit("messageAck", data.uuid);

                                    var sendMessage = msg.getSendMessage();
                                    UserManager.findSocksByUid(msg.to_user).forEach(function(sock) {
                                        sock.emit('message', sendMessage);
                                    });
                                });
                            }
                        })
                    }
                    else {
                        return sock.emit("messageError", data.uuid)
                    }
                }
                else if (data.type == Message.MessageType.Person) {
                    if (data.cid) {
                        userService.findByUid(data.cid, function(error, rows) {
                            if (error || rows.length == 0) {
                                sock.emit("messageError", data.uuid)
                            }
                            else {
                                var nameCardData = rows[0];
                                var nameCard = {
                                    id: nameCardData.id,
                                    name: nameCardData.name,
                                    nickName: nameCardData.nick_name,
                                    headImage: nameCardData.head_image,
                                    groupType: nameCardData.user_type,
                                    gender: nameCardData.gender,
                                    description: nameCardData.description
                                };

                                //msg.name_card = data.cid;
                                msg.setNameCard(nameCard);

                                messageService.insertMessage(msg, function() {
                                    sock.emit("messageAck", data.uuid);

                                    var sendMessage = msg.getSendMessage();
                                    UserManager.findSocksByUid(msg.to_user).forEach(function(sock) {
                                        sock.emit('message', sendMessage);
                                    });
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
                        var sendMessage = msg.getSendMessage();
                        UserManager.findSocksByUid(msg.to_user).forEach(function (sock) {
                            sock.emit('message', sendMessage);
                        });
                    });
                }
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
