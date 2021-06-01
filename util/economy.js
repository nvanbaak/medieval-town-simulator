// Source: http://www.svincent.com/MagicJar/Economics/MedievalOccupations.html

const jobListMaster = ["apothecary",
    "chapman",
    "haberdasher",
    "innkeeper",
    "ironmonger",
    "merchant",
    "woodmonger",
    "bard",
    "minstrel",
    "farmer",
    "hunter",
    "shepherd",
    "thresher",
    "trapper",
    "horse trainer",
    "gamekeeper",
    "astrologer",
    "sailor",
    "fisherman",
    "fishmonger",
    "beggar",
    "shoemaker",
    "chandler",
    "tailor",
    "basketmaker",
    "broom-dasher",
    "canvasser",
    "builder",
    "currier",
    "courier",
    "physician",
    "smith",
    "wheelwright",
    "servant",
    "scribe",
    "midwife",
    "trencherman"]

module.exports = class Economy {
    constructor() {
        this.jobs = jobListMaster;
    }
}