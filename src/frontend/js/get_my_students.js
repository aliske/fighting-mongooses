// logging in on the login_form doesn't seem to be working for me.
// how do i login as a parent so i can test this functionality?

// also...getting "json bad parse" error

async function getMyStudents(page) {

    // can't figure out why i'm getting "redeclaration of const ROOT_URI",
    // i import the script "root_uri.js" in "Registration.html" but i don't
    // redeclare ROOT_URI anywhere (that i know of)
    const data = await fetch(`${ROOT_URI}/api/registered_students`)
        .then(resp => { return resp.json() })

    if (page == "registration") {

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

        $('#registration-tbody').html(data_HTML)
    }
}