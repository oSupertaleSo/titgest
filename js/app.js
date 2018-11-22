window.onload = function () {
    var firebaseRef = firebase.database().ref("places");
    firebaseRef.once('value').then(function (dataSnapshot) {
        console.log(dataSnapshot.val());
    });
}

function delOnClick(param1) {
    var firebaseRef = firebase.database().ref(param1);
    firebaseRef.remove().then(function () {
        location.reload();
        // console.log(param1);
    }).catch(function (error) {
        console.log("NOPE");
    })
}

addOnClick = (param2) => {
        database.ref("Report").child(param2).once('value', (snapshot) => {
        const data = snapshot.val()
        console.log(data)
        firebase.database().ref("Process").push({
            latitude: data.latitude,
            longitude: data.longitude,
            topic: data.topic,
            description: data.description,
            date:Date.now(),
            accident:data.accident,
            roadProblem:data.roadProblem
        })
    }).then(value => {
        if (value) {
            database.ref("Report").child(param2).remove()
            location.reload();
        }
    })


    // database.ref("Report").child(param2).remove()
}
DoneOnClick = (param3) => {
    const data = database.ref("Process").child(param3).once('value', (snapshot) => {
        const data = snapshot.val()
        firebase.database().ref("Finish").push({
            latitude: data.latitude,
            longitude: data.longitude,
            topic: data.topic,
            description: data.description,
            date:Date.now(),
            accident:data.accident,
            roadProblem:data.roadProblem
        })
    }).then(value => {
        if (value) {
            database.ref("Process").child(param3).remove()
            location.reload();
        }
    })
}

    // function addOnClick(param2){
    //    const test = firebase.database().ref("Report").child(param2)
    //     console.log(test)
    //     // firebaseRef.push({
    //     //     latitude: a,
    //     //     longitude: b,
    //     //     topic: c,
    //     //     description: d,
    //     //     image: e,        
    //     // })
    // }

    function getAddress(latitude, longitude, id) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            var method = 'GET';
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&key=AIzaSyB_1gqNDYMyc10X_3lp5qh2iTM3DlAm4gE';
            var async = true;

            request.open(method, url, async);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var data = JSON.parse(request.responseText);
                        var address = data.results[0];
                        resolve(address.formatted_address);
                        document.getElementById(id).innerHTML = address.formatted_address;
                        console.log(address.formatted_address)
                    }
                    else {
                        reject(request.status);
                    }
                }
            };
            request.send();
        });
    };

    function insertProcess(a, b, c, d, e) {
        firebase.database().ref("Process").push({
            latitude: a,
            longitude: b,
            topic: c,
            description: d,
            image: e,
            date: firebase.database.ServerValue.TIMESTAMP
        })
    };

// export default{
//     insertProcess
// }