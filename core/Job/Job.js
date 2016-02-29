/**
 * Created by daniel on 16/2/29.
 */
function Job() {

}

// jid, j.title AS jtitle, j.detail AS jdetail, j.salary AS jsalary, j.salary_type AS jsalary_type,
Job.prototype.setId = function(id) {
    this.id = id;
};

Job.prototype.setTitle = function(title) {
    this.title = title;
};

Job.prototype.setDetail = function(detail) {
    this.detail = detail;
};

Job.prototype.setSalary = function(salary) {
    this.salary = salary;
};

Job.prototype.setSalaryType = function(salary_type) {
    this.salary_type = salary_type;
};

module.exports = Job;