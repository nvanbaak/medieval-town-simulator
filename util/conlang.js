const consonantMaster = ["b","c","ch","d","dh","f","g","gh","h","j","k","kh","l","m","n","p","ph","q","qu","r","s","sh","t","th","v","w","x","y","z","zh"];
const vowelMaster = ["a","ae","ai","ao","au","e","i","o","oi","ou","u","ue","y"];

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
        if (flipCoin()) {
            
            // Add it to the list
            newConsonents.push(cons);
            
            // 50% chance (so 1/4 of cases) of adding it an additional time
            if (flipCoin() ) {
                newConsonents.push(cons);

                // One last time
                if (flipCoin()) {
                    newConsonents.push(cons);
                }
            }
        }
    }

    // Repeat the process for vowels
    let newVowels = [];

    for (vow of vowelMaster) {

        // 50% chance nothing happens
        if (flipCoin()) {
            
            // Add it to the list
            newVowels.push(vow);
            
            // 50% chance (so 1/4 of cases) of adding it an additional time
            if (flipCoin() ) {
                newVowels.push(vow);

                // One last time
                if (flipCoin() && flipCoin()) {
                    newVowels.push(vow);
                }
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

    // number of phonemes is relative to footprint size
    for (let i = 0; i < con.length * vow.length * ; i++) {

        



    }
    




}

// Returns a random element of the array passed
function randomEl(array) {
    return array[Math.floor(Math.random() * array.length)]
}

// Returns true 50% of the time
function flipCoin() {
    return Math.random() > 0.5; 
}

console.log(generateSoundFootprint());