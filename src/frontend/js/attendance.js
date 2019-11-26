async function getAttendanceStatus(){

    const data = await fetch(`${ROOT_URI}/api/attendancelogging/status/`)
                    .then(resp => { return resp.json() })

    let dataHTML = data.map(row => {
            var date = new Date(row['time'])
            if(row['status'] == 1){
                var status = 'In'
            } else {
                var status = 'Out'
            }
            return `<tr><td class="td-other">${row['fname'] + ' ' + row['lname']}</td><td class="td-other">${status}</td><td class="td-other">${date}</td></tr>`

    }).join('')

    $('#current-attendance-status-tbody').html(dataHTML)

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