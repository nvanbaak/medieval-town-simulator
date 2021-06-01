const townGenBtn = $("#townGen");
const townData = $("#townData");

const townNameSpan = $(".townNameSpan");

const nameGenBtn = $("#nameGen");
const nameCol1 = $("#nameGenCol1");
const nameCol2 = $("#nameGenCol2");

const addPeasantBtn = $("#PeasantAddBtn").hide();

let peasantGen = [];

let town;
let lang;

$(document).ready(function() {

    // Generates town / culture information
    townGenBtn.click(function() {

        $.post("/api/population", {
            popSize: 0,
            lifeExpect: 50
        }).then(newTown => {

            // load town and language
            town = newTown;
            lang = town.language;

            updateConsole();

            // Display town data
            updateTownDisplay()

            // Update town name across page
            townNameSpan.text(capitalize(lang.lexicon[0].text))

            // Enable peasant generation
            nameGenBtn.prop("disabled", false);

            // Clear peasant gen and hide add button
            clearGen();
            addPeasantBtn.hide();
        });
    });

    // Generates ten peasants and lists them on the page
    nameGenBtn.click(function() {

        // Clear any previous gen data
        clearGen();

        // Start on the left side
        let left = true;

        // Get culture information
        updateConsole();
        let jobList = town.economy.jobs;
        let lifeExp = town.lifeExpectancy;
        let minNameSize = 2;

        // Make ten peasants, store in data and print to page
        for (i = 0; i < 10; i++) {

            // Get random peasant information within culture parameters
            myJob = jobList[Math.floor(Math.random() * jobList.length)];
            myLifeExp = Math.floor(Math.random() * lifeExp * 1.2);

            // Make new peasant, push to the appropriate places
            newPeasant = new Peasant(randomWord(minNameSize), myJob, myLifeExp);

            peasantGen.push(newPeasant);

            // Build and append list object
            listObj = $("<li>")
                .html("<strong>"+newPeasant.name+"</strong>, " + newPeasant.getJob() + ", " + newPeasant.age)

            if (left) {
                nameCol1.append(listObj)
                left = false;
            } else {
                nameCol2.append(listObj)
                left = true;
            }
        }

        // Now that we have peasants we can unhide the Add Peasant button if it was hidden
        addPeasantBtn.show();

    });

    // Adds the peasants from the generation box to the town
    addPeasantBtn.click(function() {

        // Add all of the peasants to the town
        for (peasant of peasantGen) {

            town.people.push(peasant);
            town.popSize++;

        }

        updateTownDisplay();

        // Clear gen to avoid adding duplicates
        clearGen();
        addPeasantBtn.hide()

    });

});

function updateTownDisplay() {
    // Display town data
    townData.empty()
    townData
        .append($("<td>").text(capitalize(lang.lexicon[0].text)))
        .append($("<td>").text(lang.name))
        .append($("<td>").text(town.popSize))
        .append($("<td>").text(town.lifeExpectancy))
}

function randomWord(minLength = 1, maxLength = 10) {

    let index = Math.floor(Math.random() * 500);
    let selection = lang.lexicon[index];

    if (selection.syllables >= minLength && selection.syllables <= maxLength) {
        return selection.text;
    } else {
        return randomWord(minLength, maxLength)
    }
}

function capitalize(word) {

    let newWord = word.charAt(0).toUpperCase() + word.slice(1);
    return newWord;
}

function updateConsole() {
    console.clear();
    console.log(town);
    console.log(lang);
}

function clearGen() {
    nameCol1.empty();
    nameCol2.empty();
    peasantGen = [];
}

class Peasant {
    constructor(name, job, age) {
        this.name = capitalize(name);
        this.age = age;
        this.job = job;
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