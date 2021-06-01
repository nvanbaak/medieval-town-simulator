const Language = require("../util/conlang.js");

module.exports = function(app) {

    app.get("/api/language", function(req, res) {

        newLang = new Language()
        res.json(newLang)

    });

};