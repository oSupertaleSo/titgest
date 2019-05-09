var problemList = {
    report: [],
    process: [],
    finish: []
};

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
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&key=AIzaSyB_1gqNDYMyc10X_3lp5qh2iTM3DlAm4gE';
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
                date = addZero(date.getDate()) + '/' +
                    addZero(date.getMonth()) + '/' +
                    date.getFullYear() + '<br>' +
                    addZero(date.getHours()) + ':' +
                    addZero(date.getMinutes()) + ':' +
                    addZero(date.getSeconds())
                var address = getAddress(value.latitude, value.longitude, '#report-address-' + i);
    
                content += '<tr>' +
                            '    <td>' + (i+1) + '</td>' +
                            '    <td>' +
                            '       <b>Topic:</b> ' + value.topic + '<br>' +
                            '       <b><i class="fa fa-user"></i> :</b> Member_User' +
                            '    </td>' +
                            '    <td id="report-address-' + i + '">' + address + '</td>' +
                            '    <td class="text-right">' + date + '</td>' +
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
                problemList.report.push({
                    topic: value.topic,
                    description: value.description,
                    date: date,
                    address: address,
                    image: value.image,
                    user: value.user
                })
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
                var value = data.val();
                var date = new Date(data.val().date);
                var key = Object.keys(snapshot.val())[i];
                date = addZero(date.getDate()) + '/' +
                    addZero(date.getMonth()) + '/' +
                    date.getFullYear() + '<br>' +
                    addZero(date.getHours()) + ':' +
                    addZero(date.getMinutes()) + ':' +
                    addZero(date.getSeconds())
                var address = getAddress(value.latitude, value.longitude, '#process-address-' + i);
    
                content += '<tr>' +
                    '    <td>' + (i+1) + '</td>' +
                    '    <td>' +
                    '       <b>Topic:</b> ' + value.topic + '<br>' +
                    '       <b><i class="fa fa-user"></i> :</b> Member_User' +
                    '    </td>' +
                    '    <td id="process-address-' + i + '">' + address + '</td>' +
                    '    <td class="text-right">' + date + '</td>' +
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
                problemList.process.push({
                    topic: value.topic,
                    description: value.description,
                    date: date,
                    address: address,
                    image: value.image,
                    user: value.user
                })
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
                var date = new Date(data.val().date);
                date = addZero(date.getDate()) + '/' +
                    addZero(date.getMonth()) + '/' +
                    date.getFullYear() + '<br>' +
                    addZero(date.getHours()) + ':' +
                    addZero(date.getMinutes()) + ':' +
                    addZero(date.getSeconds())
                var address = getAddress(value.latitude, value.longitude, '#finish-address-' + i);
    
                content += '<tr>' +
                    '    <td>' + i + '</td>' +
                    '    <td>' +
                    '       <b>Topic:</b> ' + value.topic + '<br>' +
                    '       <b><i class="fa fa-user"></i> :</b> Member_User' +
                    '    </td>' +
                    '    <td><div id="finish-address-' + i + '">' + address + '</div> </td>' +
                    '    <td class="text-right">' + date + '</td>' +
                    '    <td style="min-width: 70px; width: 70px;">' +
                    '        <button class="btn btn-primary info-modal" data-toggle="tooltip" title="View Info" data-problem-type="finish" data-id="' + (i-1) + '">' +
                    '            <i class="fa fa-search"></i>' +
                    '        </button>' +
                    '    </td>' +
                    '</tr>';
                i++;
                problemList.finish.push({
                    topic: value.topic,
                    description: value.description,
                    date: date,
                    address: address,
                    image: value.image,
                    user: value.user
                })
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

    $('#infoModal .modal-title').html(data.topic)
    $('#infoModal img').attr('src', data.image)
    $('#infoModal p.description').html(data.description)
    $('#infoModal .date').html(data.date.replace('<br>', ' '))
    $('#infoModal .user').html(data.user)
    $('#infoModal .status').removeClass('bg-success bg-warning bg-info');

    if(type == 'report') {
        $('#infoModal .status').addClass('bg-warning').html('ยังไม่รับเรื่อง')
    } else if(type == 'process') {
        $('#infoModal .status').addClass('bg-info').html('กำลังดำเนินการ')
    } else {
        $('#infoModal .status').addClass('bg-success').html('แก้ไขเรียบร้อย')
    }
    $('#infoModal').modal('show')
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