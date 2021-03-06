var problemList = {
    report: [],
    process: [],
    finish: []
};
const googleApiKey = 'AIzaSyB_1gqNDYMyc10X_3lp5qh2iTM3DlAm4gE';

var config = {
    apiKey: "AIzaSyAQqXC7P_OwwkkSfJscHLUIfro84Ipc0SI",
    authDomain: "test-2e10e.firebaseapp.com",
    databaseURL: "https://test-2e10e.firebaseio.com",
    projectId: "test-2e10e",
    storageBucket: "test-2e10e.appspot.com",
    messagingSenderId: "872972741228"
};
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function () {
    $('#menuTab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show')
    })

    renderReportProblemMenu();
    renderProcessMenu();
    renderFinishMenu();
})

function addZero(value) {
    return (value < 10 ? '0' : '') + value;
}

function getAddress(latitude, longitude, id) {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&key=' + googleApiKey;
    $.ajax({
        url: url,
        method: 'GET',
        async: true,
        success: function(response) {
            var address = response.results[0];
            $(id).html(address.formatted_address)
        }
    });
}

function renderReportProblemMenu() {
    database.ref("Report").once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var i = 0;
            problemList.report = [];
            snapshot.forEach(function (data) {
                var key = Object.keys(snapshot.val())[i];
                var value = data.val();
                var date = new Date(data.val().date);
                var date = getFullDateTime(value.date);
                var address = getAddress(value.latitude, value.longitude, '#report-address-' + i);
                var tags = getTags(value);
    
                content += '<tr>' +
                            '    <td>' + (i+1) + '</td>' +
                            '    <td>' + 
                            '       <b>' + value.topic + '</b><br>' +
                            '       <small>' + 
                            '           <b><i class="fa fa-user"></i>:</b> ' + value.user + 
                            '           <b><i class="fa fa-clock ml-2"></i>:</b> ' + date + 
                            '       </small>' +
                            '       <div id="report-address-' + i + '" class="mt-3">' + address + '</div>' +
                            '       <hr>' + tags +
                            '    </td>' +
                            '    <td>' +
                            '        <button class="btn btn-primary info-modal" data-toggle="tooltip" title="View Info" data-problem-type="report" data-id="' + i + '">' +
                            '            <i class="fa fa-search"></i>' +
                            '        </button>' +
                            '        <button class="btn btn-danger delete-record" data-key="Report/' + key + '" data-toggle="tooltip" title="Decide">' +
                            '            <i class="fa fa-times"></i>' +
                            '        </button>' +
                            '        <button class="btn btn-success accept-problem" data-key="Report/' + key + '" data-toggle="tooltip" title="Accept">' +
                            '            <i class="fa fa-check"></i>' +
                            '        </button>' +
                            '    </td>' +
                            '</tr>';
                i++;
                var problem = value;
                problem.date = date;
                problem.address = address;
                problemList.report.push(problem)
            });
            $('#report-spinner').hide();
            $('#report-table').html(content);
            $('#report-table [data-toggle="tooltip"]').tooltip()
            $('#report-table button.info-modal').click(handlerBtnInfo);
            $('#report-table button.delete-record').click(deleteRecord);
            $('#report-table button.accept-problem').click(acceptProblem);
        }
    });
}

function renderProcessMenu() {
    database.ref("Process").once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var i = 0;
            problemList.process = [];
            snapshot.forEach(function (data) {
                var key = Object.keys(snapshot.val())[i];
                var value = data.val();
                var date = new Date(data.val().date);
                var date = getFullDateTime(value.date);
                var address = getAddress(value.latitude, value.longitude, '#process-address-' + i);
                var tags = getTags(value);
    
                content += '<tr>' +
                    '    <td>' + (i+1) + '</td>' +
                    '    <td>' + 
                    '       <b>' + value.topic + '</b><br>' +
                    '       <small>' + 
                    '           <b><i class="fa fa-user"></i>:</b> ' + value.user + 
                    '           <b><i class="fa fa-clock ml-2"></i>:</b> ' + date + 
                    '       </small>' +
                    '       <div id="process-address-' + i + '" class="mt-3">' + address + '</div>' +
                    '       <hr>' + tags +
                    '    </td>' +
                    '    <td>' +
                    '        <button class="btn btn-primary info-modal" data-toggle="tooltip" title="View Info" data-problem-type="process" data-id="' + i + '">' +
                    '            <i class="fa fa-search"></i>' +
                    '        </button>' +
                    '        <button class="btn btn-danger delete-record" data-key="Process/' + key + '" data-toggle="tooltip" title="Delete">' +
                    '            <i class="fa fa-trash"></i>' +
                    '        </button>' +
                    '        <button class="btn btn-success problem-done" data-key="Process/' + key + '" data-toggle="tooltip" title="Finish">' +
                    '            <i class="fa fa-check"></i>' +
                    '        </button>' +
                    '    </td>' +
                    '</tr>';
                i++;
                var problem = value;
                problem.date = date;
                problem.address = address;
                problemList.process.push(problem)
            });
            $('#process-spinner').hide();
            $('#process-table').html(content);
            $('#process-table [data-toggle="tooltip"]').tooltip()
            $('#process-table button.info-modal').click(handlerBtnInfo);
            $('#process-table button.delete-record').click(deleteRecord);
            $('#process-table button.problem-done').click(problemDone);
        }
    });
}

function renderFinishMenu() {
    database.ref("Finish").once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var i = 1;
            problemList.finish = [];
            snapshot.forEach(function (data) {
                var value = data.val();
                var date = getFullDateTime(value.date);
                var address = getAddress(value.latitude, value.longitude, '#finish-address-' + i);
                var tags = getTags(value);
    
                content += '<tr>' +
                    '    <td>' + i + '</td>' +
                    '    <td>' + 
                    '       <b>' + value.topic + '</b><br>' +
                    '       <small>' + 
                    '           <b><i class="fa fa-user"></i>:</b> ' + value.user + 
                    '           <b><i class="fa fa-clock ml-2"></i>:</b> ' + date + 
                    '       </small>' +
                    '       <div id="finish-address-' + i + '" class="mt-3">' + address + '</div>' +
                    '       <hr>' + tags +
                    '    </td>' +
                    '    <td style="min-width: 70px; width: 70px;">' +
                    '        <button class="btn btn-primary info-modal" data-toggle="tooltip" title="View Info" data-problem-type="finish" data-id="' + (i-1) + '">' +
                    '            <i class="fa fa-search"></i>' +
                    '        </button>' +
                    '    </td>' +
                    '</tr>';
                i++;
                var problem = value;
                problem.date = date;
                problem.address = address;
                problemList.finish.push(problem)
            });
            $('#finish-spinner').hide();
            $('#finish-table').html(content);
            $('#finish-table [data-toggle="tooltip"]').tooltip()
            $('#finish-table button.info-modal').click(handlerBtnInfo);
        }
    });
}

function handlerBtnInfo() {
    const type = $(this).data('problem-type');
    const id = $(this).data('id');
    const data = problemList[type][id];

    addGoogleMap(data.topic, data.latitude, data.longitude);
    $('#infoModal .modal-title').html(data.topic);
    $('#infoModal img').attr('src', data.image);
    $('#infoModal div.tags').html(getTags(data));
    $('#infoModal p.description').html(data.description);
    $('#infoModal .date').html(data.date.replace('<br>', ' '));
    $('#infoModal .user').html(data.user);
    $('#infoModal .status').removeClass('bg-success bg-warning bg-info');

    if(type == 'report') {
        $('#infoModal .status').addClass('bg-warning').html('ยังไม่รับเรื่อง');
    } else if(type == 'process') {
        $('#infoModal .status').addClass('bg-info').html('กำลังดำเนินการ');
    } else {
        $('#infoModal .status').addClass('bg-success').html('แก้ไขเรียบร้อย');
    }
    $('#infoModal').modal('show');
}

function deleteRecord() {
    if(!confirm('คุณยืนยันที่จะลบรายการนี้ออกจากระบบใช่หรือไม่ ?')) return;

    const key = $(this).data('key');
    const $tr = $(this).parents('tr')

    database.ref(key).remove().then(function () {
        $tr.fadeOut('slow', function() { $(this).remove() })
    })
} 

function acceptProblem() {
    if(!confirm('คุณยืนยันที่จะรับการแจ้งปัญหานี้ใช่หรือไม่ ?')) return;

    const key = $(this).data('key');

    database.ref(key).once('value', (snapshot) => {
        const data = snapshot.val()
        firebase.database().ref("Process").push(data)
    }).then(value => {
        if (value) {
            database.ref(key).remove()
            location.reload();
        }
    })
}

function problemDone() {
    if(!confirm('คุณต้องการจะย้ายรายการนี้ ไปยังรายการที่เสร็จแล้วใช่หรือไม่ ?')) return;

    const key = $(this).data('key');

    database.ref(key).once('value', (snapshot) => {
        const data = snapshot.val()
        firebase.database().ref("Finish").push(data)
    }).then(value => {
        if (value) {
            database.ref(key).remove()
            location.reload();
        }
    })
}

function getTags(problem) {
    var tags = [];
    if(problem.drainSystem) {
        tags.push('Drain System');
    }
    if(problem.electricity) {
        tags.push('Electricity');
    }
    if(problem.lightSystem) {
        tags.push('Light System');
    }
    if(problem.roadProblem) {
        tags.push('Road Problem')
    }

    return tags.map(function(tag) {
        return '<button class="btn btn-sm btn-secondary mr-2">' + tag + '</button>';
    }).join('');
}

function getFullDateTime(dateTime) {
    var date = new Date(dateTime);
    date = addZero(date.getDate()) + '/' +
        addZero(date.getMonth()) + '/' +
        date.getFullYear() + ' ' +
        addZero(date.getHours()) + ':' +
        addZero(date.getMinutes()) + ':' +
        addZero(date.getSeconds())

    return date;
}

function addGoogleMap(topic, lat, lng) {
    var myLatlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 15,
        center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
        position:myLatlng,
        title: topic
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
}