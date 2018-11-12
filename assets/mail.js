const nodemailer = require('nodemailer');

function sendMailverification( mail, codigo){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'tecnomapsm@gmail.com', // generated ethereal user
            pass: 'Tecnomapsmv_1*' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: ' "Tecnomapsm", <tecnomapsm@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: 'Verificacion de cuenta Tecnomapsm ✔', // Subject line
        text: '<b>tecnomapsm.com.co te da la Bienvenida</b>', // html body
        html: `Estimado(a) Señor(a) 
        <br>
        Su registro en el Sistema se ha realizado satisfactoriamente.
        <br>
        Se le ha asignado la siguiente Cuenta de Usuario:<br>
        Usuario (su correo electronico): <b>${mail}<b>
        <br>
        Por su seguridad debe cambiar la contraseña al iniciar sesion por primera ves:<br>
        Su contraseña temporal es: <b>${codigo}<b>
        <br>
        Con esta cuenta de usuario puede ingresar Tecnomaps:<br>
        Puede ingresar a verificar su información básica a tecnomapsm.com.co :v<br>
        Puede ingresar a TECNOMAPSM para realizar operaciones de su cuenta de usuario o ingresar al Aplicativo de trasnporte nacional
        <br>
        Recuerde:<br>
        El Usuario y la Clave son personales e intransferibles<br>
        Ingresar sólo desde un movil confiable, en su casa u oficina<br>
        Cambiar frecuentemente su clave
        <br>
        Atentamente,<br>
        Sistema de Seguridad<br>
        Tecnomapsm` // plain text body
        
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

module.exports = sendMailverification;