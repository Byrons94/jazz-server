const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    sport: {
        type: String,
        required: true,
    },
    division: {
        type: String,
        required: false
    },
    titles: [{
        type: String
    }]
});

let SectionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    bannerUrl: {
        type: String,
        required: false
    },
    advertisingUrl: {
        type: String,
        required: false
    },
    events: [EventSchema]
});


let AdvertisingSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    }
});

let PlasmaConfigurationSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    viewType: {
        type: String,
        enum: ['v', 'h'],
        default: 'v',
        required: true,
    },
    lineType: {
        type: String,
        enum: ['a', 'd'], 
        default: 'a',
        required: true
    },
    viewTheme: {
        type: String,
        enum: ['l', 'd'], 
        default: 'd',
        required: true
    },
    time: {
        type: String,
        required: true
    },
    screenTime: {
        type: Number,
        required: true
    },
    advertisingLapseTime: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Date, 
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    advertisings: [AdvertisingSchema],
    sections: [SectionSchema]
});

// Export the model
module.exports = mongoose.model('PlasmaConfiguration', PlasmaConfigurationSchema);