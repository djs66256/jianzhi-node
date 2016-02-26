function Message() {
    this.from_user = null;
    this.to_user = null;
    this.type = null;
    this.time = new Date();
    this.text = null;
    this.uuid = null;

    this.downloaded = false;
};

Message.MessageType = {
    Message: 1,
    Job: 2,
    Person: 3,
    Post: 4,
    None: 0
};

Message.prototype.setFromUser = function (fromUser) {
    this.from_user = fromUser;
};

Message.prototype.setToUser = function (toUser) {
    this.to_user = toUser;
};

Message.prototype.setType = function (type) {
    this.type = type;
};

Message.prototype.setText = function (text) {
    this.text = text;
};

Message.prototype.setUuid = function (uuid) {
    this.uuid = uuid;
};

Message.prototype.setJob = function (job) {
    this.job = job;
};

Message.prototype.setNameCard = function (nameCard) {
    this.name_card = nameCard;
};

Message.prototype.getSendMessage = function() {
    var ret = {
        time: this.time.getTime(),
        uid: this.from_user,
        text: this.text,
        type: this.type,
        uuid: this.uuid
    };
    if (this.type == Message.MessageType.Job) {
        ret.jid = this.job.id;
        ret.job = this.job;
    }
    else if (this.type == Message.MessageType.Person) {
        ret.cid = this.name_card.id;
        ret.nameCard = this.name_card;
    }
    return ret;
};

module.exports = Message;