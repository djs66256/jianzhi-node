/**
 * Created by daniel on 16/2/26.
 */
var express = require('express');
var router = express.Router();
var UserManager = require('../message/UserManager');
var Message = require('../core/Message/Message');

router.get("/post/job", function(req, res, next) {
    var from = parseInt(req.query.from);
    var to = parseInt(req.query.to);
    var jid = parseInt(req.query.jid);
    var text = req.query.text;

    var message = new Message();
    message.setType(Message.MessageType.Job);
    message.setFromUser(from);
    message.setToUser(to);


    UserManager.findSocksByUid(to).forEach(function (sock) {
        sock.emit('message')
    });

    console.log(req)
});

module.exports = router;