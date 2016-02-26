/**
 * Created by daniel on 2016/1/29.
 */

var dao = require("./UserDao");
var User = require('./User');

module.exports = {
    findByUid : function(uid, callback) {
        dao.findByUid(uid, function (err, rows) {
            if (!err && rows && rows.length > 0) {
                callback(null, new User(rows[0]));
            }
            else {
                callback(err ? err : '用户不存在');
            }
        });
    }
};
