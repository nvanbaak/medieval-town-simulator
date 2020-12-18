const Language = require("./conlang.js");

module.exports = class Population {
constructor(popSize, lifeExpectancy) {

        this.popSize = popSize;
        this.lifeExpectancy = lifeExpectancy;
        this.language = new Language();
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