const Language = require("../util/conlang.js");
const Population = require("../util/demographics.js");

module.exports = function(app) {

    app.get("/api/language", function(req, res) {

        newLang = new Language()
        res.json(newLang)

    });

    // app.get("/api/population", function (req, res) {
    // });

    app.post("/api/population", function ({ body }, res) {

        newTown = new Population(body.popSize, body.lifeExpect)

        res.json(newTown)

    })

};