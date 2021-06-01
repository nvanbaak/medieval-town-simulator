module.exports = class Language {
    constructor() {
        const syllableWeightMaster = [1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 5];

        this.footprint = generateSoundFootprint();
        this.syllableSet = generateSyllableSet(this.footprint);
        this.lexicon = generateLexicon(this.syllableSet, syllableWeightMaster);

        this.name = capitalize(generateWord(this.syllableSet, syllableWeightMaster).text)
    }

    printLexicon() {
        console.log(this.lexicon);
    }

    randomWord() {
        return randomEl(this.lexicon);
    }
}

class Word {
    constructor(text, syllables) {
        this.text = text
        this.syllables = syllables
    }
}

// Generates 500 words using the provided syllable set and weight
function generateLexicon(syllables, syllableWeight) {

    let newLexicon = [];

    for (let i = 0; i < 500; i++) {
        newLexicon.push(generateWord(syllables, syllableWeight))
    }

    return newLexicon;

}

// Generates a word of random length
// syllables:       set of syllables
// syllableWeight:  set of word lengths
function generateWord(syllables, syllableWeight) {

    // Decide how many syllables
    let wordLength = randomEl(syllableWeight);
    let newWord = "";
    
    for ( let i = 0; i < wordLength; i++ ) {
        newWord += randomEl(syllables);
    }

    let wordObj = new Word(newWord, wordLength);

    return wordObj;
}

// Makes a sound footprint object
function generateSoundFootprint() {

    const consonantMaster = ["b","c","ch","d","f","g","h","j","k","l","m","n","p","q","r","sh","t","th","v","w","x","y","z"];
    const vowelMaster = ["a","e","i","o","u","ue","y"];

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
        }
    }

    // Repeat the process for vowels
    let newVowels = [];

    for (vow of vowelMaster) {

        // 80% we add the vowel
        if ( d100(80) ) {
            
            // Add it to the list
            newVowels.push(vow);
            
            // Slight chance to add it again
            if ( d100(20) ) {
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

// Returns a syllable generated from the sound footprint passed
function generateSyllable( {con, vow} ) {

    let newSyllable = "";

    // 60% of words have a beginning consonant
    if ( d100(60) ) {

        newSyllable += randomEl(con);
        
        // 10% of beginning consonants are compound consonants
        if ( d100(10) ) newSyllable += randomEl(con);
    }

    // All syllables have a vowel
    newSyllable += randomEl(vow);

    // 5% of syllables have multiple vowels
    if ( d100(5) ) newSyllable += randomEl(vow);

    // 50% of words have ending consonants
    if ( d100(50) ) {
        newSyllable += randomEl(con);

        // 5% of ending consonants are compound consonants
        if ( d100(5) ) newSyllable += randomEl(con);
    }

    return newSyllable;
}

// takes a sound footprint object and makes it a phoneme
function generateSyllableSet( footprint ) {

    let newSyllableSet = [];

    // number of syllables is relative to footprint size
    for (let i = 0; i < footprint.con.length * footprint.vow.length * 2; i++) {

        newSyllableSet.push( generateSyllable(footprint) );

    }

    return newSyllableSet;

}

// Returns a random element of the array passed
function randomEl(array) {
    return array[Math.floor(Math.random() * array.length)]
}

// Rolls a d100 and returns true based on the threshold passed to the function (e.g. d100(80) returns true 80% of the time)
function d100(num) {
    return (Math.random() * 100) < num; 
}

// Capitalizes the first letter of the string
function capitalize(string) {
    newString = string.charAt(0).toUpperCase() + string.slice(1);
    return newString;
}