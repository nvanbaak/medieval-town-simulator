$(document).ready(function() {

    const townGenBtn = $("#townGen");
    const townData = $("#townData");

    const townNameSpan = $(".townNameSpan");

    const nameGenBtn = $("#nameGen");
    const nameCol1 = $("#nameGenCol1");
    const nameCol2 = $("#nameGenCol2");

    const addPeasantBtn = $("#peasantAddBtn").hide();

    const runSimBtn = $("#runSim");
    const simOutput = $("#simulationOutput");

    let peasantGen = [];
    let simLog = [];

    let town;
    let lang;

    // Setup show/hide behavior for h2
    $("h2").click(event => {
        let section = $(event.currentTarget).data("section");
        $(".section"+section).toggle();
    });

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

        }

        updateTownDisplay();

        // Clear gen to avoid adding duplicates
        clearGen();
        addPeasantBtn.hide()

    });

    // Cycles the simulation when the button is pressed
    runSimBtn.click(function() {
        cycleSimulation();
    });

    // Runs one step of the simulation
    function cycleSimulation() {
        // Peasant death variables
        let oldAge = town.lifeExpectancy * 0.9;
        let maxLife = town.lifeExpectancy * 1.4;
        let dangerZone = maxLife - oldAge;
        let infantMort = 10;
        let baseDeathRate = 0.01

        // Age up everyone
        for (i = 0; i < town.people.length; i++) {
            let peasant = town.people[i];
            peasant.age++;

            // Are they still alive? First check old age
            if (peasant.age > oldAge) {

                let deathChance = (peasant.age - oldAge)/dangerZone;

                if (Math.random() < deathChance) {
                    postToSimOutput(peasant.name + " has died of old age at " + peasant.age + ".");
                    town.people.splice(i, 1);
                    continue;
                }
            }
            // Young peasants also have a change of dying (infant mortality in the middle ages was terrible)
            else if (peasant.age < infantMort) {
                if (Math.random() < 0.10) {
                    postToSimOutput(peasant.name + ", " + peasant.age + ", has died.");
                    town.people.splice(i, 1);
                    continue;
                }
            }

            // Otherwise there's a slight chance of dying from life events
            else if (Math.random() < baseDeathRate) {
                postToSimOutput(peasant.name + ", " + peasant.age + ", has died in an accident.");
                town.people.splice(i, 1);
                continue;
            }

        }
        postToSimOutput("A year has passed.");
        
        updateConsole();
        updateTownDisplay();
        console.log(town.people);
    }

    function updateTownDisplay() {
        // Display town data
        townData.empty()
        townData
            .append($("<td>").text(capitalize(lang.lexicon[0].text)))
            .append($("<td>").text(lang.name))
            .append($("<td>").text(town.people.length))
            .append($("<td>").text(town.lifeExpectancy))
    }
    
    function postToSimOutput(text) {
        
        // Put notice in the array, then delete the earliest one if there's too many
        simLog.push(text);
        if (simLog.length > 10) {
            simLog.shift();
        }
        
        // Empty simlog and repopulate
        simOutput.empty();

        for (log of simLog) {

            let listObj = $("<li>").text(log);
            simOutput.append(listObj);

        }
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

});