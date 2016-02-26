/**
 * Created by daniel on 16/2/26.
 */
var express = require('express');
var router = express.Router();
var userManager = require('../message/UserManager');

router.get("/post/job", function(req, res, next) {
    var from = parseInt(req.query.from);
    var to = parseInt(req.query.to);
    var jid = parseInt(req.query.jid);
    var text = req.query.text;

    var sock = userManager.findSockByUid(to);
    if (sock) {
        sock.emit('message')
    }

    console.log(req)
});

module.exports = router;