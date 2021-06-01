const nameGenBtn = $("#nameGen")
const nameCol1 = $("#nameGenCol1")
const nameCol2 = $("#nameGenCol2")

const names = ["Bob", "Joe", "Calvin", "Hobbes", "Whitman", "Donne", "Bach", "Lincoln", "Tesla", "Galvani"]


$(document).ready(function() {

    nameGenBtn.click(function() {

        nameCol1.empty()
        nameCol2.empty()

        for (i = 0; i < 5; i++) {
            nameCol1.append(
                $("<li>").text(names[Math.floor(Math.random()*10)])
            )
            nameCol2.append(
                $("<li>").text(names[Math.floor(Math.random()*10)])
            )
        }

    })

});