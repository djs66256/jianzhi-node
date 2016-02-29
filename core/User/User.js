
function User(row) {
    this.data = row;
    if (row) {
        this.id = row.id;
        this.name = row.name;
        this.nickName = row.nick_name;
        this.headImage = row.head_image;
        this.groupType = row.group_type;
        this.gender = row.gender;
        this.description = row.description;
    }
}

User.prototype.setId = function(id) {
    this.id = id;
};

User.prototype.setNickName = function(nickName) {
    this.nickName = nickName;
};

User.prototype.setName = function(name) {
    this.name = name;
};

User.prototype.setHeadImage = function(headImage) {
    this.headImage = headImage;
};

User.prototype.setGroupType = function(groupType) {
    this.groupType = groupType;
};

User.prototype.setGender = function(gender) {
    this.gender = gender;
};

User.prototype.setDescription = function(description) {
    this.description = description;
};

User.prototype.getNameCard = function () {
    return this;
};

module.exports = User;
