const townGenBtn = $("#townGen");
const townData = $("#townData");

const townNameSpan = $(".townNameSpan");

const nameGenBtn = $("#nameGen");
const nameCol1 = $("#nameGenCol1");
const nameCol2 = $("#nameGenCol2");

const addPeasantBtn = $("#PeasantAddBtn").hide();

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
                .append($("<td>").text(capitalize(lang.lexicon[0].text)))
                .append($("<td>").text(lang.name))
                .append($("<td>").text(town.popSize))
                .append($("<td>").text(town.lifeExpectancy))

            // Update town name across page
            townNameSpan.text(capitalize(lang.lexicon[0].text))

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
                $("<li>").text(randomWord(2))
            )
            nameCol2.append(
                $("<li>").text(randomWord(2))
            )
        }

        addPeasantBtn.show();

    });

    // addPeasantBtn.click(function() {



    // });

});

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