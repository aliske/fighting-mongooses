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

    let data_HTML = data.map(row => {

        const row_data = headers.map(header => {
            return `<td class="td-other>${row[header.internal] || ''}</td>`
        }).join('')

        return `<tr>${row_data}</tr>`
    }).join('')

    $('#registration-table').html(headers_HTML + data_HTML)
}