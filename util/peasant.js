
module.exports = class Peasant {
    constructor(name, job, age, sex = null) {
        this.name = capitalize(name);
        this.age = age;
        this.job = job;
        this.isPregnant = false;

        // flip a coin for sex assignment if one wasn't provided
        if (sex == null) {
            if (Math.random < 0.5) {
                this.sex = "m";
                this.pronouns = ["he","him","his"];
            } else {
                this.sex = "f";
                this.pronouns = ["she","her","hers"];
            }
        } else {
            this.sex = sex;
        }
    }

    getJob() {
        if (this.age > 11) {
            return this.job;
        } else if (this.age > 6) {
            return "apprentice " + this.job;
        } else {
            return "child"
        }
    }
}