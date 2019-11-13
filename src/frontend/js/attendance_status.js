async function getAttendanceStatus(){

    const data = await fetch(`${ROOT_URI}/api/attendancelogs/status/`)
                    .then(resp => { return resp.json() })

    console.log(data)

    let dataHTML = data.map(row => {
            if(row['status'] == 1){
                var status = 'In'
            } else {
                var status = 'Out'
            }
            return `<tr><td class="td-other">${row['fname'] + ' ' + row['lname']}</td><td class="td-other">${status}</td><td class="td-other">${row['time']}</td></tr>`

    }).join('')

    console.log(dataHTML)
    $('#current-attendance-status-tbody').html(dataHTML)

}