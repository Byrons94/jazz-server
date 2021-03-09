const mongoose = require('mongoose')
const Schema = mongoose.Schema

// • Create Schema. This will be used later to define model fields (db columns)
const PlasmaLinesSchema = new Schema({
  title: String,
  content: String
})

// • Created Model below will help us to work with MongoDB easily.
var PlasmaLinesModel = mongoose.model('PlasmaLines', PlasmaLinesSchema)

// • Export Model
module.exports = PlasmaLinesModel
