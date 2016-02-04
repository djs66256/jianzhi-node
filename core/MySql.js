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
};


module.exports = new MySql();
