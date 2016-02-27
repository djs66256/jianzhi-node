/**
 * Created by daniel on 2016/1/29.
 */
var mysql = require('../MySql');
//var connection = require('../MySql').connection;

module.exports = {
    findByUid : function(uid, callback) {
        mysql.connection.query("SELECT * FROM user WHERE id=:uid", {uid:uid}, callback)
    }
};