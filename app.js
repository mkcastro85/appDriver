const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
const sendMail = require('./assets/mail');
const Driver = require('./models/driver');
const Vehicle = require('./models/vehicle'); 

let app = express();

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('', (req, res)=>{
    res.send({message:'hello'});
});

app.post('/api/driver/create-an-account', (req, res)=>{
    console.log('ejecutando metodo post crear conductor');
    let driver = new Driver();
    driver.name_completed = req.body.name_completed;
    driver.id = req.body.id;
    driver.mail = req.body.mail;
    driver.cellphone = req.body.cellphone;
    driver.id_motorcycle = req.body.id_motorcycle;
    driver.profile_photo = req.body.profile_photo;
    driver.password = Math.random().toString(36).substring(8).toUpperCase();
    
    driver.save((err, driveStored)=>{
        if(err) 
            res.status(500).send({message: `Error al almacenar los datos [${err}]`});
        sendMail(driveStored.mail, driveStored.password);
        res.status(200).send({driver: driveStored});
    }); 
});

app.post('/api/sing-in', (req, res)=>{
    console.log('ejecutando metodo post para iniciar sesion');
    let mail = req.body.mail;
    let pass = req.body.password;
    
    Driver.findOne({mail:mail, password:pass}, (err, driver)=>{
        if (err) return res.status(500).send({message:`Error al realizar la petición: [${err}]`});
        if(!driver) return res.status(404).send({message: 'Usuario no existe'});
        
        res.status(200).send({user: driver});
    });
});

app.post('/api/driver/vehicle/create',(req, res)=>{
    console.log('ejecutando metodo post crear vehiculo conductor');

});

app.put('/api/driver/:', (req, res)=>{

});

app.delete('', (req, res)=>{

});

mongoose.connect('mongodb://localhost:27017/schema_tecnomapsm', (err, res)=>{
    if(err) throw err;
    console.log('conexion establecida');

    app.listen(3000,  () => {
        console.log('app listening on port 3000!');
    });
});
