async function getAttendanceStatus(){

    const data = await fetch(`${ROOT_URI}/api/attendancelogging/status/`)
                    .then(resp => { return resp.json() })

    let dataHTML = data.map(row => {
            var date = new Date(row['time']).toLocaleString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
            if(row['status'] == 1){
                var status = 'In'
            } else {
                var status = 'Out'
            }
           return `<tr><td class="td-other">${row['fname'] + ' ' + row['lname']}</td><td class="td-other">${status}</td><td class="td-other">${date}</td><td class="td-other"><button class='btn btn-primary' id='edit-btn' onclick="showAttendanceHistory(${row['id']})">Show History</button></td></tr>`

    }).join('')

    $('#current-attendance-status-tbody').html(dataHTML)

}

async function getAttendanceHistory(user){
    const data = await fetch(`${ROOT_URI}/api/attendancelogging/history/${user}`)
                    .then(resp => { return resp.json() })
    let dataHTML = data.map(row => {
        var date = new Date(row['time']).toLocaleString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
        if(row['status'] == 1){
            var status = 'Logged In'
        } else {
            var status = 'Logged Out'
        }
        return `<tr>><td class="td-other">${date}</td><td class="td-other">${status}</td></tr>`
    }).join('')

    $('#attendance-history-title').html("Attendance Log History for " + data[0]['fname'] + " " + data[0]['lname'])
    $('#attendance-history-tbody').html(dataHTML)
}

async function checkInOut(user, status){
    const body = {
      'user': user,
      'status': status
    }
    await fetch(`${ROOT_URI}/api/attendancelogging/checkinout/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    window.location.reload(true);
}