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


let PlasmaConfigurationSchema = new Schema({
    code: {
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
    time: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    createdDate: {
        type: Date, 
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true
    },
    sections: [SectionSchema]
});

// Export the model
module.exports = mongoose.model('PlasmaConfiguration', PlasmaConfigurationSchema);