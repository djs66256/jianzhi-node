/**
 * Created by daniel on 2016/1/29.
 */

var connection = require('../MySql').connection;

module.exports = {
    findByTokenAndUid : function(token, uid, callback) {
        connection.query("SELECT * FROM token WHERE token=? AND id=?", [token, uid], function(error, rows) {
            if (!error) {
                if (rows && rows.length > 0) {
                    callback(null, rows[0])
                }
                else {
                    callback("不存在该token", null)
                }
            }
            else {
                callback(error, null)
            }
        })
    }
};