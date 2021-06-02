const Language = require("./conlang.js");
const Economy = require("./economy.js");

module.exports = class Population {
constructor(popSize, lifeExpectancy) {

        this.lifeExpectancy = lifeExpectancy;
        this.language = new Language();
        this.economy = new Economy();
        
        this.people = [];

        for (let i = 0; i < popSize; i++ ) {
            this.people.push(generatePerson(this.language.randomWord(), lifeExpectancy))
        }
    }

    printPop() {
        console.table(this.people);
    }
}

function generatePerson(name, lifeExpectancy) {
    return {
        name: name,
        age: generateAge(lifeExpectancy)
    }
}

function generateAge(lifeExpectancy) {

    // people sometimes live past life expectancy
    let oldAge = Math.ceil(lifeExpectancy * 1.1);

    return Math.floor(Math.random() * oldAge);
}