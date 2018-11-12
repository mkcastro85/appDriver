const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverShema = new Schema({
    name_completed: String,
    id: Number,
    cellphone: String,
    id_motorcycle: String,
    mail: String,
    password: String,
    profile_photo: {type: String, default: 'img/motocycle/default'},
    temporal: {type: Boolean, default: true}  
});

module.exports = mongoose.model('Driver', driverShema);
