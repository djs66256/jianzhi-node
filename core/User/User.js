
function User(row) {
    this.data = row;
}

User.prototype.getNameCard = function () {
    return {
        id: this.data.id,
        name: this.data.name,
        nickName: this.data.nick_name,
        headImage: this.data.head_image,
        groupType: this.data.user_type,
        gender: this.data.gender,
        description: this.data.description
    }
};

module.exports = User;
