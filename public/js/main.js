const nameGenBtn = $("#nameGen");
const nameCol1 = $("#nameGenCol1");
const nameCol2 = $("#nameGenCol2");

const townGenBtn = $("#townGen");
const townData = $("#townData");

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
            townData.empty()
            townData
                .append($("<td>").text(capitalize(lang.lexicon[0])))
                .append($("<td>").text(lang.name))
                .append($("<td>").text(town.popSize))
                .append($("<td>").text(town.lifeExpectancy))

            // Enable peasant generation
            nameGenBtn.prop("disabled", false);

        });

    });

    // Generates ten peasants and lists them on the page
    nameGenBtn.click(function() {

        nameCol1.empty()
        nameCol2.empty()

        for (i = 0; i < 5; i++) {
            nameCol1.append(
                $("<li>").text(randomWord())
            )
            nameCol2.append(
                $("<li>").text(randomWord())
            )
        }

    });

});

function randomWord() {
    let index = Math.floor(Math.random() * 500)
    return lang.lexicon[index]
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