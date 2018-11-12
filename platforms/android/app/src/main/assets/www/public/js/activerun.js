var storage = firebase.storage();
var actualPos = { lat: 0, lng: 0 };

function uploadProfileImage() {
    let pathIgmage = `images/profile/${sessionStorage._id}/profile`;
    var imgref = storage.ref(pathIgmage);
    imgref.getDownloadURL().then(function (url) {
        if (url) {
            document.getElementById('profile-img').src = url;
        }
        //console.log(a);
    }, function (err) {
        console.log(err.message_);
    })
}

function activeVehicle() {
    if ($('#on')[0].classList[2] === undefined) {
        sessionStorage.active = 'true';
        alert('driver activated');
        location.href = './location.html';
    }
}

function inactiveVehicle() {
    if ($('#off')[0].classList[2] === undefined) {
        sessionStorage.active = 'false';
        alert('inactive driver');
    }
}

$(document).ready(function () {
    if (location.pathname === '/public/active-run.html') {
        uploadProfileImage();
    }

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

    $('#on').on('click', activeVehicle);

    $('#off').on('click', inactiveVehicle);

});