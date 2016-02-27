/**
 * Created by daniel on 16/2/26.
 */
var express = require('express');
var router = express.Router();
var UserManager = require('../message/UserManager');
var MessageManager = require('../message/MessageManager');
var Message = require('../core/Message/Message');

router.post("/post/job", function(req, res, next) {
    var from = parseInt(req.param('from'));
    var to = parseInt(req.param('to'));
    var jid = parseInt(req.param('jid'));
    var text = req.param('text');
    var uuid = req.param('uuid');

    if (from && to && jid && uuid) {

        var msg = {
            from_user: from,
            to_user: to,
            type: Message.MessageType.Job,
            text: text,
            uuid: uuid,
            jid: jid
        };
        sendMessage(msg, function(err, message) {
            if (err) {
                res.send({retCode: 0, content: err})
            }
            else {
                res.send({retCode: 1, content: message.uuid});
            }
        });
    }
    else {
        res.send({retCode: 0, content: '数据格式错误'});
    }
});


router.post("/post/resume", function(req, res, next) {
    var from = parseInt(req.param('from'));
    var to = parseInt(req.param('to'));
    var uid = parseInt(req.param('uid'));
    var text = req.param('text');
    var uuid = req.param('uuid');

    if (from && to && uid && uuid) {

        var msg = {
            from_user: from,
            to_user: to,
            type: Message.MessageType.Person,
            text: text,
            uuid: uuid,
            cid: uid
        };
        sendMessage(msg, function(err, message) {
            if (err) {
                res.send({retCode: 0, content: err})
            }
            else {
                res.send({retCode: 1, content: message.uuid});
            }
        });
    }
    else {
        res.send({retCode: 0, content: '数据格式错误'});
    }
});

function sendMessage(data, callback) {
    MessageManager.parse(data, function (err, message) {
        if (err) {
            callback(err);
            return;
        }
        var sendMessage = message.getSendMessage();
        UserManager.findSocksByUid(data.to_user).forEach(function (sock) {
            sock.emit('message', sendMessage);
        });
        callback(null, message)
    });
}

module.exports = router;