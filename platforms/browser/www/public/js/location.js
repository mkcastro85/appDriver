const url = window.location.origin;
var actualPos;
var socket = io.connect('http://apidrivers.herokuapp.com', {'forceNew': true});
//var socket = io.connect('https://tecnomapsm.herokuapp.com', { 'forceNew': true });
var places = [];
var client = '';


/*function getLocationDriverActive() {
 $.ajax({
 url: 'https://tecnomapsm.herokuapp.com/users/locations',
 //url: 'http://apidrivers.herokuapp.com/users/locations',
 method: 'GET',
 dataType: 'JSON',
 success: function (result) {
 
 for (let i = 0; i < result.location.length; i++) {
 if (result.location[i]._id !== sessionStorage._id) {
 console.log(result.location[i]._id6 + ' = ' + sessionStorage._id);
 let latlng = new google.maps.LatLng(result.location[i].location);
 marker = new google.maps.Marker({
 position: latlng,
 map: map,
 title: "Latitude:" + latlng.lat + " | Longitude:" + latlng.lng,
 icon: url + '/public/images/moto-icon.png'
 });
 }
 }
 
 },
 error: function (jqXHR, textStatus) {
 $('#message').html(jqXHR);
 }
 });
 }*/

function retrievePlace() {
    $.ajax({
        //url: `https://tecnomapsm.herokuapp.com/users/place`,
        url: `http://apidrivers.herokuapp.com/users/place`,
        method: 'GET',
        dataType: 'JSON',
        success: function (result) {
            for (let i = 0; i < result.place.length; i++) {
                places[result.place[i]._id] = result.place[i];
            }
        },
        error: function (jqXHR, textStatus) {
            $('#message').html(jqXHR);
        }
    });
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}

function initialize(actualPosition) {

    let myOptions = {
        zoom: 16,
        center: actualPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
    if (sessionStorage.rol === 'driver') {
        if (sessionStorage.active === 'true') {
            marker = new google.maps.Marker({
                position: actualPosition,
                map: map,
                title: "Latitude:" + actualPosition.lat + " | Longitude:" + actualPosition.lng,
                //icon: url + '/public/images/moto-icon-active.png'
            });
        } else {
            marker = new google.maps.Marker({
                position: actualPosition,
                map: map,
                title: "Latitude:" + actualPosition.lat + " | Longitude:" + actualPosition.lng,
                icon: url + '/public/images/moto-icon-inactive.png'
            });
        }
    } else {
        marker = new google.maps.Marker({
            position: actualPosition,
            map: map,
            title: "Latitude:" + actualPosition.lat + " | Longitude:" + actualPosition.lng,
            icon: url + '/public/images/user-icon-active.png'
        });
    }

    //  getLocationDriverActive(); // agregamos los marcadores de los conductores activos

}

//Load google map
//google.maps.event.addDomListener(window, 'load', initialize);

function onSuccess(position) {
    actualPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }
    initialize(actualPos);
}

function activeVehicle() {
    console.log($('#on')[0].classList[2]);
    alert('driver activated');
    if ($('#on')[0].classList[2] === undefined) {
        sessionStorage.active = 'true';
        socket.emit('active', {
            _id: sessionStorage._id,
            name_completed: sessionStorage.name_completed,
            ubication: actualPos
        });
    }
}

function inactiveVehicle() {
    console.log($('#off')[0].classList[2]);
    alert('inactive driver');
    if ($('#off')[0].classList[2] === undefined) {
        socket.emit('inactive', {
            _id: sessionStorage._id,
            name_completed: sessionStorage.name_completed,
            ubication: actualPos
        });
    }
}

function usuarioAceptado() {
    document.getElementById('aceptar').setAttribute('hidden', true);
    socket.emit('usuarioAceptado', {
        _id: client,
        name: sessionStorage.name_completed,
        id: sessionStorage.id,
        location: actualPos,
        description: 'aceptada',
    });
    document.getElementById('iniciarviaje').removeAttribute('hidden');
    document.getElementById('terminarviaje').removeAttribute('hidden');



}

function iniciarViaje() {
    document.getElementById('iniciarviaje').setAttribute('hidden', true);


}

function terminarViaje() {
    document.getElementById('terminarviaje').setAttribute('hidden', true);
    document.getElementById('iniciarviaje').setAttribute('hidden', true);
    document.getElementById('aceptar').removeAttribute('hidden');
    document.getElementById('cancelar').removeAttribute('hidden');


     $('#element-run').html("");
    document.getElementById('info').setAttribute('hidden', true);
    $("#element-run").show();
    
    socket.emit('carreraTerminada', {
        _id: client,
        name: sessionStorage.name_completed,
        id: sessionStorage._id,
        location: actualPos,
        description: 'terminado',
    });


}


$(document).ready(function () {


    document.getElementById('iniciarviaje').setAttribute('hidden', true);
    document.getElementById('terminarviaje').setAttribute('hidden', true);
    navigator.geolocation.getCurrentPosition(onSuccess, onError);


    if (sessionStorage.rol === 'driver') {
        if (sessionStorage.active === 'true') {
            $('#element-run').html(`<label class="btn btn-secondary active" id="on">
                    <input type="radio" name="options" autocomplete="off" checked> On 
                    </label>
                    <label class="btn btn-secondary" id="off">
                    <input type="radio" name="options"  autocomplete="off"> Off
                    </label>`
                    )
        } else {
            $('#element-run').html(`<label class="btn btn-secondary " id="on">
                    <input type="radio" name="options" autocomplete="off" checked> On 
                    </label>
                    <label class="btn btn-secondary active" id="off">
                    <input type="radio" name="options" autocomplete="off"> Off
                    </label>`
                    )
        }
    }

    retrievePlace();

    $('#on').on('click', activeVehicle);

    $('#off').on('click', inactiveVehicle);

    $('#aceptar').on('click', usuarioAceptado);

    $('#iniciarviaje').on('click', iniciarViaje);

    $('#terminarviaje').on('click', terminarViaje);

   

    socket.on('newclientconnect', function (data) {
        console.log(data);
    });

    socket.on('activeSays', function (data) {
        console.log(data.name_completed);
    });

    socket.on('inactiveSays', function (data) {
        console.log(data);
    });

    socket.on('ClientsolicitandoVehicle', function (data) {
        if (sessionStorage.active === 'true') {
            client = data._id;
            var message = `<div class="alert alert-primary" role="alert" id="message-run">
                <p><strong>User</strong>: ${data.name_completed}</p>
                <p><strong>start</strong>: ${data.origin}</p>
                <p><strong>Destionation</strong>: ${places[data.destination].name}</p>
                <p><strong>Description</strong>: ${data.description}</p> 
                </div>`;

            document.getElementById('message-run').innerHTML = message;
            document.getElementById('info').removeAttribute('hidden');
        }

    });
});
