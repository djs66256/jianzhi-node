/**
 * Created by daniel on 16/2/23.
 */

var connection = require('../MySql').connection;

module.exports = {

    findById: function(id, cb) {
        var sql = "SELECT * FROM job WHERE id=:id LIMIT 1";
        var params = {
            id:id
        };
        connection.query(sql, params, function(err, rows) {
            cb(err, rows)
        })
    }

};