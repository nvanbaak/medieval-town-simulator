const consonantMaster = ["b","c","ch","d","dh","f","g","gh","h","j","k","kh","l","m","n","p","ph","q","qu","r","s","sh","t","th","v","w","x","y","z","zh"];
const vowelMaster = ["a","ah","ae","ai","ao","au","e","i","o","oh","oi","ou","u","ue","y"];

// export default class Language {
class Language {
    constructor() {

    }

    

}

// Makes a sound footprint object
function generateSoundFootprint() {

    // define new consonant set
    let newConsonents = [];

    // Now we add consonants to the set.  We'll do this by removing some from the master list and oversampling others to make the language feel more organic.

    // For each consonant in the master list...
    for (cons of consonantMaster) {

        // 50% chance nothing happens
        if ( d100(50) ) {
            
            // Add it to the list
            newConsonents.push(cons);
            
            // 50% chance (so 1/4 of cases) of adding it an additional time
            if ( d100(50) ) {
                newConsonents.push(cons);

            }
            
        // 25% of adding again (so 1/8 of cases)
        if ( d100(25) ) {
            newConsonents.push(cons);
        }
    }
    }

    // Repeat the process for vowels
    let newVowels = [];

    for (vow of vowelMaster) {

        // 50% chance nothing happens
        if ( d100(50) ) {
            
            // Add it to the list
            newVowels.push(vow);
            
            // 50% chance (so 1/4 of cases) of adding it an additional time
            if ( d100(50) ) {
                newVowels.push(vow);

            }

            // 25% of adding again (so 1/8 of cases)
            if ( d100(25) ) {
                newVowels.push(vow);
            }
        }
    }

    // Having defined the sound footprint, we return those arrays as an object
    return {
        con: newConsonents,
        vow: newVowels
    }
}

// takes a sound footprint object and makes it a phoneme
function generatePhonemeSet( { con, vow } ) {

    // number of syllables is relative to footprint size
    for (let i = 0; i < con.length * vow.length * 2; i++) {

        let newSyllable = "";

        // beginning consonant (or not)
        newSyllable += randomEl(con)


        // vowel

        // diphthong (or not)

        // ending consonant (or not)









    }
}

// Returns a random element of the array passed
function randomEl(array) {
    return array[Math.floor(Math.random() * array.length)]
}

// Rolls a d100 and returns true based on the threshold passed (e.g. d100(80) returns true 80% of the time)
function d100(num) {
    return (Math.random() * 100) < num; 
}

console.log(generateSoundFootprint());