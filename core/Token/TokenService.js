
var dao = require('./TokenDao')

module.exports = {
    validate: function(token, uid, callback) {
        dao.findByTokenAndUid(token, uid, function(err, tokenObj) {
            if (!err && tokenObj && new Date() > tokenObj.expire_date) {
                callback(true);
            }
            else {
                callback(false);
            }
        })
    }
};
