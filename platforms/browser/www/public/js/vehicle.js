var storage = firebase.storage();
var tagElemet = ['left', 'right', 'front', 'rear'];

function updateVehicle(vehicle) {

    left = `images/vehicle/${sessionStorage._id}/left`,
            right = `images/vehicle/${sessionStorage._id}/right`,
            front = `images/vehicle/${sessionStorage._id}/front`,
            rear = `images/vehicle/${sessionStorage._id}/rear`


    $.ajax({
        //url: `https://tecnomapsm.herokuapp.com/users/vehicle/${sessionStorage._id}`,
        url: `http://apidrivers.herokuapp.com/users/vehicle/${sessionStorage._id}`,
        method: 'PUT',
        data: {left, right, front, rear},
        dataType: 'JSON',
        success: function (result) {
            alert("Success Update Vehicle!")
            setTimeout(function () {
                location.href = './active-run.html';
            }, 3000);
        },
        error: function (jqXHR, textStatus) {
            alert(jqXHR);
        }
    });
}

function viewImage(idElement, pathIgmage) {
    var imgref = storage.ref(pathIgmage);
    var a = imgref.getDownloadURL().then(function (url) {
        // console.log('imagen descargada');
        //console.log(err);
        if (url) {
            console.log(idElement)
            var a = document.getElementById(idElement).src = url;
        }
        //console.log(a);
    }, function (err) {
        console.log(err.message_);
    })
}


function uploadImage(e) {
    //alert('entre 2')
    var file = e.target.files[0];
    console.log(file);
    var elementFile = e.target.name;
    var storageRef = ''
    var rutaImageF = '';
    // Crear un storage ref
    if (e.target.name === 'profile') {
        storageRef = firebase.storage().ref(`images/profile/${sessionStorage._id}/${e.target.name}`);
        rutaImageF = `images/profile/${sessionStorage._id}/${e.target.name}`;
    } else {
        storageRef = firebase.storage().ref(`images/vehicle/${sessionStorage._id}/${e.target.name}`);
        rutaImageF = `images/vehicle/${sessionStorage._id}/${e.target.name}`;
    }

    // Subir archivo
    var task = storageRef.put(file);
    // Actualizar barra progreso
    task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                let idElement = `uploader-${elementFile}`;
                console.log(idElement);
                document.getElementById(idElement).value = percentage;
            },
            function error(err) {
            },
            function complete() {
                let elementImg = `${elementFile}-img`;
                viewImage(elementImg, rutaImageF);
            }
    )
}

function loadImage() {
    rutaImageP = `images/profile/${sessionStorage._id}/profile`;
    viewImage('profile-img', rutaImageP)
    document.getElementById('uploader-profile').value = 100
    for (let i = 0; i < 4; i++) {
        let idElementI = `${tagElemet[i]}-img`;
        let pathIgmageF = `images/vehicle/${sessionStorage._id}/${tagElemet[i]}`;
        viewImage(idElementI, pathIgmageF)
        document.getElementById(`uploader-${tagElemet[i]}`).value = 100
    }
}

function cameraPhoto(id) {
    navigator.camera.getPicture(function (imageData) {
        uploadImageCamera(imageData, id);
    },
    onFail, {quality: 50,
                destinationType: Camera.DestinationType.DATA_URL});
}

function onFail(message) {
    alert('Error en la camara: ' + message);
}

function uploadImageCamera(imageData, name) {
    //alert('entre 2')

    var file = 'data:image/jpeg;base64,' + imageData;
    ;
    var elementFile = name;
    var storageRef = ''
    var rutaImageF = '';
    // Crear un storage ref

    storageRef = firebase.storage().ref(`images/vehicle/${sessionStorage._id}/${name}`);
    rutaImageF = `images/vehicle/${sessionStorage._id}/${name}`;


    // Subir archivo
    var task = storageRef.putString(file, firebase.storage.StringFormat.DATA_URL);
    // Actualizar barra progreso
    task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                let idElement = `uploader-${elementFile}`;
                console.log(idElement);
                document.getElementById(idElement).value = percentage;
            },
            function error(err) {
            },
            function complete() {
                let elementImg = `${elementFile}-img`;
                var downloadURL = task.snapshot.downloadURL;
                viewImage(elementImg, rutaImageF);
            }
    )
}


$(document).ready(function () {

    if (sessionStorage.temporal === 'false') {
        loadImage();
    }

    $('#profile').on('change', uploadImage);
    $('#left').on('change', uploadImage);
    $('#right').on('change', uploadImage);
    $('#front').on('change', uploadImage);
    $('#rear').on('change', uploadImage);

    $('#update').on('click', updateVehicle);

});