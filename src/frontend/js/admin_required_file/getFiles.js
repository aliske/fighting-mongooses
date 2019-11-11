async function getFiles() {
  const uri = `${ROOT_URI}/api/required_file`

  // raw query
  const data = await fetch(uri, { credentials: 'include' })
                .then(resp => { 
                  return resp.json() 
                })
                .catch(err => {
                  displayAlert("No connection, please sign in again if needed", 'alert-danger');
                })

  const headers = [
    {
      'internal_name': 'id',
      'display_name': 'id'
    },
    {
      'internal_name': 'uuid',
      'display_name': 'uuid'
    },
    {
      'internal_name': 'title',
      'display_name': 'Title'
    },
    {
      'internal_name': 'description',
      'display_name': 'Description'
    },
    {
      'internal_name': 'cdate',
      'display_name': 'Created Date'
    }
  ]
  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = `<tr>${headers_HTML}<th>View</th><th>Delete</th></tr>`

  let data_HTML = data.map(row => {
    const row_data = headers.map(header => {
      // defaults to '' if null
      return `<td>${row[header.internal_name] || ''}</td>` 
    }).join('')

    return `
    <tr>${row_data}
      <td>
        <button class='btn btn-secondary btn-sm' onclick='viewUpload("${row['uuid']}", "${row['mimetype']}", "${row['public']}")'>
          View
        </button>
      </td>
      <td>
        <button type=button class='btn btn-danger btn-sm' onclick='deleteFile("${row['uuid']}")'>
          Delete
        </button>
      </td>
    </tr>`
  }).join('') 

  $('#uploads-table').html(headers_HTML + data_HTML)

}

