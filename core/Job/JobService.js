/**
 * Created by daniel on 16/2/23.
 */

var dao = require("./JobDao");

module.exports = {
    findById: function(id, cb) {
        dao.findById(id, cb)
    }
}