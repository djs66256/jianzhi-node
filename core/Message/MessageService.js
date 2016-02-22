
var dao = require("./MessageDao");

module.exports = {
    insertMessage: function(message, cb) {
        dao.insertMessage(message, cb)
    },

    findUndownloadedByFromUser : function(uid, callback) {
        dao.findUndownloadedByFromUser(uid, callback)
    },

    setDownloadedByUuid: function(uuid, callback) {
        dao.setDownloadedByUuid(uuid, callback);
    }
};