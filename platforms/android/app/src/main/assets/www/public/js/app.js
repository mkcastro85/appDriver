function createAnAccount() {
    console.log("Crear cuenta");
    $("#message").html("en proceso");
   
    $.ajax({
       // url: 'https://tecnomapsm.herokuapp.com/users/sign-up',
        url: 'http://apidrivers.herokuapp.com/users/sign-up',
        method: 'POST',
        data: $('#form-create-an-account').serialize(),
        dataType: 'JSON',
        success: function (result) {
            let message = "<div class='alert alert-success'><strong>Success registration!</strong> En un tiempo maximo de 24 horas se le enviara un correo y/o mensaje al celular con el codigo para poder ingresar</div>"
            $('#message').html(message);
            setTimeout(function(){  
                location.href = './../index.html'; 
            }, 5000);
        },
        error: function(jqXHR, textStatus){
            console.log(textStatus);
            $('#message').html("Error");
        }
    });
}

function logon() {
    $.ajax({
        //url: 'https://tecnomapsm.herokuapp.com/users/sign-in',
        url: 'http://apidrivers.herokuapp.com/users/sign-in',
        method: 'POST',
        data: $('#form-logon').serialize(),
        dataType: 'JSON',
        success: function (result) {
            sessionStorage.token = result.token;
            sessionStorage.name_completed = result.user.name_completed;
            sessionStorage.cellphone = result.user.cellphone;
            sessionStorage.rol = result.user.rol;
            sessionStorage.id = result.user.id;
            if( result.user.rol === 'driver') {
                sessionStorage.id_motorcycle = result.user.vehicle.id_motorcycle;
                sessionStorage.active = result.user.active;
            }

            sessionStorage._id = result.user._id;
            sessionStorage.temporal = result.user.temporal;
            
            if(result.user.rol === 'driver') {
                location.href = './idvehicle.html';
            }else {
                location.href = './locationuser.html';
            }
        },
        error: function(jqXHR, textStatus){
            console.log(jqXHR);
        }
    });
}


$(document).ready(function () {
    $('#form-id-motorcycle').hide();
    $('#rol-user').change(function (e) {
        if (e.target.value === 'driver') {
            $('#form-id-motorcycle').show();
        } else {
            $('#form-id-motorcycle').hide();
        }
    });
});
