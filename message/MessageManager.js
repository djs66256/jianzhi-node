/**
 * Created by daniel on 16/2/27.
 */


var messageService = require('../core/Message/MessageService');
var jobService = require('../core/Job/JobService');
var userService = require('../core/User/UserService');
var Message = require('../core/Message/Message');

function MessageManager() {

}

/**
 *
 * @param data = {
                    from_user: user.uid,
                    to_user: data.uid,
                    type: data.type,
                    text: data.text,
                    uuid: data.uuid,
                    jid: data.jid,
                    cid: data.cid
                };
 * @param callback (err, message)
 * @returns {*}
 */
MessageManager.prototype.parse = function (data, callback) {
    var msg = new Message();
    msg.setFromUser(data.from_user);
    msg.setToUser(data.to_user);
    msg.setType(data.type);
    msg.setText(data.text);
    msg.setUuid(data.uuid);

    if (msg.type == Message.MessageType.Job) {
        if (data.jid) {
            jobService.findById(data.jid, function(error, rows) {
                if (error || rows.length == 0) {
                    callback(error ? error : '工作不存在');
                }
                else {
                    msg.setJob(rows[0]);

                    messageService.insertMessage(msg, function(err) {
                        callback(err, msg);
                    });
                }
            })
        }
        else {
            return callback('工作不存在');
        }
    }
    else if (data.type == Message.MessageType.Person) {
        if (data.cid) {
            userService.findByUid(data.cid, function(error, user) {
                if (error) {
                    callback(error ? error : '用户不存在');
                }
                else {
                    var nameCard = user.getNameCard();
                    msg.setNameCard(nameCard);

                    messageService.insertMessage(msg, function(err) {
                        callback(err, msg);
                    });
                }
            })
        }
        else {
            return callback('用户不存在');
        }
    }
    else {
        messageService.insertMessage(msg, function(err) {
            callback(err, msg);
        });
    }
};

module.exports = new MessageManager();