const nameGenBtn = $("#nameGen");
const nameCol1 = $("#nameGenCol1");
const nameCol2 = $("#nameGenCol2");

const townGenBtn = $("#townGen");

let lang;

$(document).ready(function() {

    townGenBtn.click(function() {

        $.ajax("/api/language", {
            type: "GET"
        }).then(newLang => {
        
            // Load language
            console.log(newLang)
            lang = newLang;

            // Enable peasant generation
            nameGenBtn.prop("disabled", false);
        
        });

    })

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

    })

});

function randomWord() {
    let index = Math.floor(Math.random() * 500)
    return lang.lexicon[index]
}