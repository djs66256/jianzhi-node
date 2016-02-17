/**
 * Created by daniel on 2016/1/29.
 */

function MySql() {
    this.mysql = require('mysql');

}

MySql.prototype.connect = function(options) {
    //{
    //    host: 'localhost',
    //        user: 'root',
    //    password: '',
    //    database: 'jianzhi',
    //    debug: true
    //}
    this.connection = this.mysql.createConnection(options);
    this.connection.connect();
    this.connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };
};

module.exports = new MySql();
