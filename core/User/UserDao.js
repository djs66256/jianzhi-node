/**
 * Created by daniel on 2016/1/29.
 */
var connection = require('../MySql').connection;

module.exports = {
    findByUid : function(uid, callback) {
        connection.query("SELECT * FROM user WHERE id=:uid", {uid:uid}, callback)
    }
};