async function getMyStudents() {

    const data = await fetch(`${ROOT_URI}/api/registered_students/`)
        .then(resp => { return resp.json() })

    const headers = [
        { 'internal': 'fname', 'display': 'First Name' },
        { 'internal': 'lname', 'display': 'Last Name' },
    ]

    let headers_HTML = headers.map(header => {
        return `<th>${header.display}</th>`
    }).join('')
    headers_HTML = `<tr>${headers_HTML}</tr>`

    let data_HTML = data.map(row => {

        const row_data = headers.map(header => {
            return `<td>${row[header.internal] || ''}</td>`
        }).join('')

        return `<tr>${row_data}</tr>`
    }).join('')

    $('#registration-table').html(headers_HTML + data_HTML)
}