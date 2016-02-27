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
        MessageManager.parse(msg, function (err, message) {
            if (err) {
                res.send({retCode: 0, content: err});
                return;
            }
            var sendMessage = message.getSendMessage();
            UserManager.findSocksByUid(to).forEach(function (sock) {
                sock.emit('message', sendMessage);
            });
            res.send({retCode: 1, content: uuid});
        });
    }
    else {
        res.send({retCode: 0, content: '数据格式错误'});
    }
});

module.exports = router;