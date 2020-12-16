import Language from "./conlang.js";

require("./conlang.js");


// export default class Population {
class Population {
constructor(popSize, lifeExpectancy) {

        this.popSize = popSize;
        this.lifeExpectancy = lifeExpectancy;
        this.language = new Language();
        this.people = [];
        
        for (let i = 0; i < popSize; i++ ) {
            this.people.push(generatePerson(lifeExpectancy))
        }
    }

    print() {
        console.log(this.people);
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
    let oldAge = Math.ceiling(lifeExpectancy * 1.1);

    return Math.floor(Math.random() * oldAge);
}

const peasants = new Population(5000, 50);
peasants.print();