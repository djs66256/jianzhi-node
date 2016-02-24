/**
 * Created by daniel on 2016/1/29.
 */

var dao = require("./UserDao");

module.exports = {
    findByUid : function(uid, callback) {
        dao.findByUid(uid, callback);
    }
}
