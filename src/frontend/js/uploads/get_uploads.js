async function getUploads(public = true) {
  let uri;
  if (public === true)
    uri = `${ROOT_URI}/api/file/public`
  else 
    uri = `${ROOT_URI}/api/file/me`
  // raw query
  
  const data = await fetch(uri, { credentials: 'include' })
                  .then(resp => { return resp.json() })


  const headers = [
    {
      'internal_name': 'user',
      'display_name': 'Author'
    },
    {
      'internal_name': 'uuid',
      'display_name': 'uuid'
    },
    // {
    //   'internal_name': 'filename',
    //   'display_name': 'Title'
    // },
    {
      'internal_name': 'public',
      'display_name': 'public?'
    }
    // {
    //   'internal_name': 'cdate',
    //   'display_name': 'Date'
    // }
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
        <button type=button class='btn btn-danger btn-sm' onclick='deleteUpload("${row['uuid']}")'>
          Delete
        </button>
      </td>
    </tr>`
  }).join('') 


  $('#uploads-table').html(headers_HTML + data_HTML)
}



async function deleteUpload(uuid){
  const data = await fetch(`${ROOT_URI}/api/file/${uuid}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(resp => { 
      if (resp.status === 200) {
        displayAlert('record deleted successfully', 'alert-success')
        getUploads()
      }
      else
        displayAlert(data.msg, 'alert-danger');
    })
}

