/**
 * Created by daniel on 2016/1/29.
 */
var mysql = require('../MySql');

var Message = require('./Message');
var Job = require('../Job/Job');
var User = require('../User/User');

module.exports = {
    initTable: function() {
        //var sql = "CREATE TABLE IF NOT EXISTS message"
        connection.query(sql, null, null)
    },

    insertMessage: function(message, cb) {
        var sql = "INSERT INTO message (from_user, to_user, type, uuid, time, text, job, name_card, downloaded)" +
            "VALUES (:from_user, :to_user, :type, :uuid, :time, :text, :job, :name_card, :downloaded)";
        var params = {
            from_user: message.from_user,
            to_user: message.to_user,
            type: message.type,
            time: message.time,
            text: message.text,
            uuid: message.uuid,
            downloaded: false,
            job: null,
            name_card: null
        };
        if (message.job) {
            params.job = message.job.id;
        }
        if (message.name_card) {
            params.name_card = message.name_card.id;
        }
        mysql.connection.query(sql, params, cb)
    },

    findByFromUserAndToUserAndUuid: function(fromUser, toUser, uuid, cb) {
        var sql = "SELECT * FROM message WHERE from_user=:fromUser";
        var params = {fromUser:fromUser};
        mysql.connection.query(sql, params, function(err, rows) {
            console.log(rows);
        });
    },

    findUndownloadedByToUser : function(uid, callback) {
        var sql = "SELECT " +
            " m.from_user AS mfrom_user, m.to_user AS mto_user, m.type AS mtype, m.time AS mtime, m.text AS mtext, m.uuid AS muuid," +
            " j.id AS jid, j.title AS jtitle, j.detail AS jdetail, j.salary AS jsalary, j.salary_type AS jsalary_type," +
            " u.id AS uid, u.gender AS ugender, u.name AS uname, u.nick_name AS unick_name, u.head_image AS uhead_image, u.group_type AS ugroup_type, u.description AS udescription" +
            " FROM message m" +
            " LEFT JOIN job j ON m.job = j.id" +
            " LEFT JOIN user u ON m.name_card=u.id" +
            " WHERE m.to_user=:to_user" +
            " AND m.downloaded=:downloaded";
        mysql.connection.query(sql, {to_user: uid, downloaded: false}, function(error, rows) {
            if (error) {
                callback(error, null);
            }
            else {
                var messages = [];
                rows.forEach(function(row) {
                    var message = new Message();
                    message.setFromUser(row.mfrom_user);
                    message.setToUser(row.mto_user);
                    message.setText(row.mtext);
                    message.setType(row.mtype);
                    message.setUuid(row.muuid);

                    if (message.type == Message.MessageType.Job || message.type == Message.MessageType.Post) {
                        var job = new Job();
                        job.setId(row.jid);
                        job.setTitle(row.jtitle);
                        job.setSalary(row.jsalary);
                        job.setSalaryType(row.jsalary_type);
                        job.setDetail(row.jdetail);

                        message.setJob(job);
                    }
                    if (message.type == Message.MessageType.Person || message.type == Message.MessageType.Post) {
                        var user = new User();
                        user.setId(row.uid);
                        user.setName(row.uname);
                        user.setNickName(row.unick_name);
                        user.setGender(row.ugender);
                        user.setGroupType(row.ugroup_type);
                        user.setHeadImage(row.uhead_image);

                        message.setNameCard(user.getNameCard());
                    }

                    messages.push(message);
                });
                callback(null, messages);
            }
        })
    },

    setDownloadedByUuid: function(uuid, callback) {
        var sql = "UPDATE message SET downloaded=:downloaded WHERE uuid=:uuid"
        var params = {downloaded: true, uuid: uuid}
        mysql.connection.query(sql, params, function(error, rows) {
            callback();
        });
    }
};
