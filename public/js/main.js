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

    let logOutputPause = true;

    // Add one update per second to the log
    let logOutputTimer = setInterval( function() {

        // run if not paused
        if ( !logOutputPause) {

            // Empty simlog and repopulate
            simOutput.empty();

            let logLength = (simLog.length < 10) ? simLog.length : 10;
    
            // Print the first ten items
            for (i = 0; i < logLength; i++) {
    
                let listObj;
                let log = simLog[i];
                
                // This lets us bold important messages by prefixing "**"
                if (log.substring(0,2) == "**") {
                    listObj = $("<li>").html("<strong>" + log.substring(2, log.length) + "</strong>")
                } else {
                    listObj= $("<li>").text(log);
                }
                
                simOutput.append(listObj);

            }

            // If there are more than 10 items, delete the oldest one
            if (simLog.length > 10) {
                simLog.shift();
            }
        }

    }, 1000);

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
            runSimBtn.prop("disabled", false);

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

        // Make ten peasants, store in data and print to page
        for (i = 0; i < 10; i++) {

            let newPeasant = makeRandomPeasant(town);

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
        if (town.people.length > 0) {
            cycleSimulation();
            logOutputPause = false;
        } else {
            simLog = []
            simLog.push("Your town is empty. Add some peasants to start the simulation.")
        }
    });

    // Runs one step of the simulation
    function cycleSimulation() {

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
        / * Everyone hits menopause at 45. 
        / 
        */

        // Defines the range in which old age checks occur.
        let oldAge = town.lifeExpectancy * 0.8;
        let maxLife = town.lifeExpectancy * 1.4;
        let dangerZone = maxLife - oldAge;

        let infantMortLimit = 10;
        let infantMortRate = 0.04;

        let childbirthMort = 0.015;
        let stillbornRate = 0.5;

        let baseDeathRate = 0.01;
        
        let fertilityRate = 0.23; // placeholder value
        let minBirthingAge = 20;
        let maxBirthingAge = 45;

        // Update each peasant
        for (i = 0; i < town.people.length; i++) {
            let peasant = town.people[i];

            // Age up, then check mortality
            peasant.age++;

            // Are they still alive? First check old age
            if (peasant.age > oldAge) {

                let deathChance = (peasant.age - oldAge)/dangerZone;

                if (Math.random() < deathChance) {
                    simLog.push(peasant.name + " has died of old age at " + peasant.age + ".");
                    town.people.splice(i, 1);
                    continue;
                }
            }
            
            // Next, check infant mortality
            else if (peasant.age < infantMortLimit) {
                if (Math.random() < infantMortRate) {
                    simLog.push(peasant.name + ", " + peasant.age + ", has died too soon.");
                    town.people.splice(i, 1);
                    continue;
                }
            }

            // Next, resolve pregnancies
            else if (peasant.isPregnant) {
                let momSurvives = true;

                // Check if the mom died
                if (Math.random() < childbirthMort) {
                    momSurvives = false;
                }

                // Check if the kid died
                if (Math.random() < stillbornRate) {

                    // Announcement changes based on mom's survival
                    if (momSurvives) {
                        simLog.push(peasant.name + "'s baby was stillborn.")
                        peasant.isPregnant = false;
                    } else {
                        simLog.push(peasant.name + " and her baby have died in childbirth.")
                        town.people.splice(i, 1);
                        continue;
                    }

                } 
                // If the kid lived, generate them and add them to the town
                else {

                    let newPeasant = makeRandomPeasant(town);
                    newPeasant.age = -1; // We're adding them to the end of the array, so the loop will hit them and ++ their age to 0 before it finishes
                    let babySex = ((newPeasant.sex == "m") ? "boy" : "girl");
                    town.people.push(newPeasant);

                    // As before, announcement changes based on whether the mom survived
                    if (momSurvives) {

                        simLog.push(peasant.name + " gave birth to a baby " + babySex + "!  " + "She names " + newPeasant.pronouns[1] + " " + newPeasant.name + ".");

                        peasant.isPregnant = false;

                    } else {

                        simLog.push(peasant.name + " died giving birth to a baby " + babySex + "!  " + "Her grieving relatives name the child " + newPeasant.name + ".")

                        town.people.splice(i, 1);
                        continue;

                    }

                }


            }

            // Otherwise there's a slight chance of dying from life events
            else if (Math.random() < baseDeathRate) {
                simLog.push(peasant.name + ", " + peasant.age + ", has died in an accident.");
                town.people.splice(i, 1);
                continue;
            }

            // Check if peasant gets pregnant
            if (peasant.sex == "f") {
                if (minBirthingAge < peasant.age && peasant.age < maxBirthingAge) {
                    if (Math.random() < fertilityRate) {
                        peasant.isPregnant = true;
                        simLog.push(peasant.name + ", " + peasant.age + ", is pregnant.")
                    }
                }
            }

        }
        simLog.push("**A year has passed.");

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

    function makeRandomPeasant(town, minNameSize = 2) {
        let jobList = town.economy.jobs;
        let lifeExp = town.lifeExpectancy;

        // Get random peasant information within culture parameters
        let myJob = jobList[Math.floor(Math.random() * jobList.length)];
        let myLifeExp = Math.floor(Math.random() * lifeExp * 1.2);

        // Make new peasant, push to the appropriate places
        newPeasant = new Peasant(randomWord(minNameSize), myJob, myLifeExp);

        return newPeasant;
    }

    class Peasant {
        constructor(name, job, age, sex = null) {
            this.name = capitalize(name);
            this.age = age;
            this.job = job;
            this.isPregnant = false;

            // flip a coin for sex assignment if one wasn't provided
            if (sex == null) {
                if (Math.random < 0.5) {
                    this.sex = "m";
                    this.pronouns = ["he","him","his"];
                } else {
                    this.sex = "f";
                    this.pronouns = ["she","her","hers"];
                }
            } else {
                this.sex = sex;
            }
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