const Language = require("./conlang.js");
const Economy = require("./economy.js");

const demoSettings = {

    /* MORTALITY MECHANICS
    /
    / The main sources of mortality are each checked once per 
    / year:
    /
    / * OLD AGE: sources put medieval life expectancy at 
    / 40-50. Chance of old age death increases starting at 
    / age 40.
    / 
    / * INFANT MORTALITY: we check from birth until age 10 
    / (Source: https://academic.oup.com/ije/article/34/6/1435/707557).
    / * Young peasants have a 4% chance of dying per year 
    / (which over 10 years equates to about a 2/3rds chance 
    / of surviving childhood (which tracks with the usual 
    / figure of 30+% youth mortality, see e.g. https://www.thoughtco.com/medieval-child-surviving-infancy-1789124#:~:text=The%20highest%20estimated%20percentage%20I,modern%20science%20has%20thankfully%20overcome.)
    /
    / * PREGNANCY: "Daily Life in Medieval Europe" gives a 
    / figure of 14.4 deaths per 1,000 births in Florence 
    / (source: https://www.reddit.com/r/pureasoiaf/comments/id91pt/the_definite_guide_to_childbirth_mortality_in/); 
    / other numbers found while googling put the number in 
    / the 1-3% range, so 1.5% is a good ballpark
    / * About 50% of medieval births were successful, 
    / according to http://www.kyrackramer.com/2019/03/25/medieval-fertility-rates/
    / 
    / * Finally, if none of these apply to a peasant, they 
    / have a 1% chance of dying anyways (household accident, 
    / disease, crime, etc.)
    */ 

    /* PREGNANCY MECHANICS
    /
    / All eligible women have a chance of becoming pregnant 
    / each year. Eligibility uses the following criteria:
    /
    / * MARRIED: not implemented yet
    /
    / * PREMARITAL RELATIONSHIP: not implemented yet
    /
    / * AGE: while medieval women got married super early, 
    / they didn't start having children until their 20's (source: https://www.quora.com/What-was-the-average-age-of-women-when-they-had-their-first-baby-in-the-Middle-Ages).
    / * At 35 fertility begins to drop.  Childbirth stops at 45.
    / 
    */

    "oldAge" : 0.8,
    "maxLife" : 1.4,
    "dangerZone" : 0.6,
    "infantMortLimit" : 10,
    "infantMortRate" : 0.04,
    "childbirthMort" : 0.015,
    "stillbornRate" : 0.5,
    "baseDeathRate" : 0.01,
    "fertilityRate" : 0.23, // premarital placeholder
    "minBirthingAge" : 20,
    "birthingSunset" : 35,
    "maxBirthingAge" : 45
}

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