
var dao = require("./MessageDao");

module.exports = {
    insertMessage: function(message, cb) {
        dao.insertMessage(message, cb)
    },

    findUndownloadedByToUser : function(uid, callback) {
        dao.findUndownloadedByToUser(uid, function (err, messages) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, messages);
            }
        })
    },

    setDownloadedByUuid: function(uuid, callback) {
        dao.setDownloadedByUuid(uuid, callback);
    }
};