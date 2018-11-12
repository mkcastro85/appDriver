const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    id_motorcycle: String,
    left_photo: {type: String, default: 'img/motocycle/default'},
    right1_photo: {type: String, default: 'img/motocycle/default'},
    front_photo: {type: String, default: 'img/motocycle/default'},
    rear_photo: {type: String, default: 'img/motocycle/default'}
});

module.exports = mongoose.model('Vehicle', vehicleSchema);