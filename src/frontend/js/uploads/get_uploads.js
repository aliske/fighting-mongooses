async function getUploads(public = true) {
  let uri;
  if (public === true)
    uri = `${ROOT_URI}/api/storage/public`
  else 
    uri = `${ROOT_URI}/api/storage/me`
  // raw query
  const data = await fetch(uri)
                  .then(resp => { return resp.json() })



  const headers = [
  {
      'internal_name': 'author',
      'display_name': 'Author'
    },
    {
      'internal_name': 'filename',
      'display_name': 'Title'
    },
    {
      'internal_name': 'file_url',
      'display_name': 'File URL'
    },
    {
      'internal_name': 'isPublic',
      'display_name': 'public?'
    },
    {
      'internal_name': 'cdate',
      'display_name': 'Date'
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
        <button class='btn btn-secondary btn-sm' onclick='viewUpload("${row['uuid']}", "${row['filename']}", "${row['filetype']}", "${row['isPublic'].data[0]}")'>
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
  const data = await fetch(`${ROOT_URI}/api/storage/${uuid}`, {
    method: 'DELETE'
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

