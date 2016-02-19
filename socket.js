/**
 * New node file
 */
//var Message = require('./message/Message');
var UserManager = require('./message/UserManager');

var tokenService = require('./core/Token/TokenService');
var messageService = require('./core/Message/MessageService');
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
                        rows.every(function(row) {
                            row.uid = row.fromUser;
                            delete row["toUser"];
                            delete row["fromUser"];
                        });
                        sock.emit("message", rows)
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
                msg.fromUser = user.uid;
                msg.toUser = data.uid;
                msg.type = data.type;
                msg.text = data.text;
                msg.uuid = data.uuid;

                messageService.insertMessage(msg, function() {
                    sock.emit("messageAck", data.uuid);
                    var toUsers = UserManager.findByUid(data.uid);
                    toUsers.forEach(function(user){
                        data.time = msg.time;
                        io.sockets.connected[user.sockid].emit('message', data);
                    })
                });
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

            }
            else if (typeof(data) == "string") {

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
	return token;
}
