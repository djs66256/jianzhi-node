
module.exports = function() {
    this.from_user = null;
    this.to_user = null;
    this.type = null;
    this.time = new Date();
    this.text = null;
    this.uuid = null;

    this.downloaded = false;
};

module.exports.MessageType = {
    Message: 1,
    Job: 2,
    Person: 3,
    Post: 4,
    None: 0
};
