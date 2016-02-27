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
        var sql = "INSERT INTO message (from_user, to_user, type, uuid, time, text, job, name_card)" +
            "VALUES (:from_user, :to_user, :type, :uuid, :time, :text, :job, :name_card)";
        var params = {
            from_user: message.from_user,
            to_user: message.to_user,
            type: message.type,
            time: message.time,
            text: message.text,
            uuid: message.uuid,
            job: null,
            name_card: null
        };
        if (message.job) {
            params.job = message.job.id;
        }
        if (message.name_card) {
            params.name_card = message.name_card.id;
        }
        connection.query(sql, params, cb)
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
            " WHERE to_user=:to_user" +
            " AND downloaded=false" +
            " ORDER BY time DESC";
        connection.query(sql, {to_user: uid}, function(error, rows) {
            callback(error, rows)
        })
    },

    setDownloadedByUuid: function(uuid, callback) {
        var sql = "UPDATE message SET downloaded=:downloaded WHERE uuid=:uuid"
        var params = {downloaded: true, uuid: uuid}
        connection.query(sql, params, function(error, rows) {
            callback();
        });
    }
};
