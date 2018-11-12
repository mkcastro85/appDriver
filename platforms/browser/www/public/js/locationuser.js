const url = window.location.origin;
var places = [];
var originRun = '';
var positionUser = {
    last: 0,
    lng: 0
};

var socket = io.connect('http://localhost:3000', { 'forceNew': true });
//var socket = io.connect('https://tecnomapsm.herokuapp.com', { 'forceNew': true });


function retrievePlace() {
    $.ajax({
       // url: `https://tecnomapsm.herokuapp.com/users/place`,
        url: `http://localhost:3000/users/place`,
        method: 'GET',
        dataType: 'JSON',
        success: function (result) {

            var options = '<option value="null">¿A que lugar desea ir?</option>';
            for (let i = 0; i < result.place.length; i++) {
                places[result.place[i]._id] = result.place[i];
                options += `<option value="${result.place[i]._id}">${result.place[i].name}</option>`
            }

            document.getElementById('destination').innerHTML = options;
        },
        error: function (jqXHR, textStatus) {
            $('#message').html(jqXHR);
        }
    });
}


function onSuccessU(position) {
    positionUser = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }
}

// onError Callback receives a PositionError object
//
function onErrorU(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function startRun() {

    var message = `<div class="alert alert-primary" role="alert" id="message-run">
        <p><strong>User</strong>: ${sessionStorage.name_completed}</p>
        <p><strong>start</strong>: ${originRun}</p>
        <p><strong>Destionation</strong>: ${places[document.getElementById('destination').value].name}</p>
        <p><strong>Price</strong>: ${places[document.getElementById('destination').value].price}</p>
        
    <div>
    `;

    document.getElementById('message-run').innerHTML = message;
    document.getElementById('info').removeAttribute('hidden');
}

function initMap() {
    var markerArray = [];

    navigator.geolocation.getCurrentPosition(onSuccessU, onErrorU);

    // Crear una instancia de un servicio de indicaciones.
    var directionsService = new google.maps.DirectionsService;

    // Crea un mapa y céntralo en Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: { lat: 10.3931341, lng: -75.4877889 },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Crea un procesador de direcciones y lézalo al mapa.
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });

    // Crea una instancia de una ventana de información para contener el texto del paso.
    var stepDisplay = new google.maps.InfoWindow;

    // Muestra la ruta entre las selecciones iniciales y finales iniciales.

    // Escuche para cambiar eventos de las listas de inicio y final.
    var onChangeHandler = function () {
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
    };

    var onClickRun = function () {
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
    }

    document.getElementById('dest').addEventListener('click', function () {
        onChangeHandler();
        setTimeout(startRun, 2000);

    });
}


function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // Primero, elimine todos los marcadores existentes del mapa.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Recupere las ubicaciones de inicio y final y cree una DirectionsRequest usando
    // WALKING direcciones.

    directionsService.route({
        origin: positionUser,
        destination: places[document.getElementById('destination').value].location,
        travelMode: 'WALKING'
    }, function (response, status) {
        // Enrute las instrucciones y pase la respuesta a una función para crear
        // marcadores para cada paso.
        if (status === 'OK') {
            document.getElementById('warnings-panel').innerHTML =
                '<b>' + response.routes[0].warnings + '</b>';
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
    // Para cada paso, coloque un marcador y agregue el texto a la ventana de información del marcador.
    // También adjunte el marcador a una matriz para que podamos seguirlo y eliminarlo
    // al calcular nuevas rutas.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
        if (i === 0 || i === myRoute.steps.length) {

            var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
            marker.setMap(map);
            marker.setPosition(myRoute.steps[i].start_location);
            attachInstructionText(
                stepDisplay, marker, myRoute.steps[i].instructions, map);
        }

    }
    originRun = myRoute.start_address;
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function () {
        // Abra una ventana de información cuando se hace clic en el marcador, que contiene el texto
        // del paso.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}

function solicitarVehicle() {
    document.getElementById('solicitar').setAttribute('hidden', true);
    socket.emit('solicitarVehicle', {
        _id: sessionStorage._id,
        name: sessionStorage.name_completed,
        destination: document.getElementById('destination').value,
        origin: originRun,
        location: positionUser,
        description: 'Solicitando vehiculo',
    })
}

function restInfo() {
    document.getElementById('info').setAttribute('hidden', true);
}

window.onload = function () {
    retrievePlace();
    document.getElementById('solicitar').addEventListener('click', solicitarVehicle);

    $('#destination').on('change', restInfo);

    socket.on('driverAcepto', function (data) {
        if (data._id === sessionStorage._id) {
            var message = `<div class="alert alert-primary" role="alert" id="message-run">
                <p><strong>Usuario</strong>: ${sessionStorage.name_completed}</p>
                <p><strong>Conductor</strong>: ${data.name_completed} - ${data.id}</p>
                <p><strong>Inicio</strong>: ${originRun}</p>
                <p><strong>Destionation</strong>: ${places[document.getElementById('destination').value].name}</p>
                <p><strong>Precio</strong>: ${places[document.getElementById('destination').value].price}</p>
            <div>
            `;
            document.getElementById('message-run').innerHTML = message;
            let latlng = new google.maps.LatLng( data.location);

            console.log(latlng);
            console.log('-----');
            console.log(data.location);
            /*marker = new google.maps.Marker({
                position:latlng,
                map: map,
                icon: url + '/public/images/moto-icon-active.png'
            });*/
        }
    });

}
