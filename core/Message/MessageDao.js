/**
 * Created by daniel on 2016/1/29.
 */

var connection = require('../MySql').connection;

module.exports = {
    initTable: function() {
        //var sql = "CREATE TABLE IF NOT EXISTS message"
        connection.query(sql, null, null)
    },

    insertMessage: function(message, cb) {
        var sql = "INSERT INTO message (from_user, to_user, type, uuid, time, text)" +
            "VALUES (:from_user, :to_user, :type, :uuid, :time, :text)"
        var params = {
            from_user: message.fromUser,
            to_user: message.toUser,
            type: message.type,
            time: message.time,
            text: message.text,
            uuid: message.uuid
        };
        connection.query(sql, params, function(err) {
            cb(err)
        })
    },

    findByFromUserAndToUserAndUuid: function(fromUser, toUser, uuid, cb) {
        var sql = "SELECT * FROM message WHERE from_user=:fromUser";
        var params = {fromUser:fromUser};
        connection.query(sql, params, function(err, rows) {
            console.log(rows);
        });
    },

    findUndownloadedByFromUser : function(uid, callback) {
        var sql = "SELECT * FROM message" +
            " WHERE to_user=:toUser" +
            " AND downloaded=false" +
            " ORDER BY time DESC";
        connection.query(sql, {toUser: uid}, function(error, rows) {
            callback(error, rows)
        })
    }
};