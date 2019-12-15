async function getFiles(option) {
  document.currentTab = option
  let uri, headers;

  switch (option) {
    case 'required_files':
      uri = `${ROOT_URI}/api/required_file/`
      headers = [
        {
          'internal_name': 'id',
          'display_name': 'id'
        },
        // {
        //   'internal_name': 'uuid',
        //   'display_name': 'uuid'
        // },
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
      break;
    case 'public_files':
      uri = `${ROOT_URI}/api/file/public`
      headers = [
        {
          'internal_name': 'id',
          'display_name': 'id'
        },
        // {
        //   'internal_name': 'uuid',
        //   'display_name': 'uuid'
        // },
        {
          'internal_name': 'cdate',
          'display_name': 'Created Date'
        }
      ]
      break;
    default:
      return;
  }


  // raw query
  const data = await fetch(uri, { credentials: 'include' })
                .then(resp => {
                  return resp.json()
                })
                .catch(err => {
                  displayAlert("No connection, please sign in again if needed", 'alert-danger');
                })

  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = option === 'required_files' ? `<tr>${headers_HTML}<th>Edit</th><th>View</th><th>Delete</th></tr>` : `<tr>${headers_HTML}<th>View</th><th>Delete</th></tr>`

  let data_HTML = data.map(row => {
    const row_data = headers.map(header => {
      // defaults to '' if null
      return `<td>${row[header.internal_name] || ''}</td>` 
    }).join('')

    return `
    <tr>${row_data}` +
    (option === 'required_files' ?
    `
    <td>
      <button class='btn btn-info btn-sm' onclick='editRequiredFile("${row['uuid']}", "${row['title']}", "${row['description']}")'>
        Edit
      </button>
    </td>` : '')
    + `
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



async function editRequiredFile(uuid, title, description) {
  let new_title = prompt('Update Title', title)

  // return if cancelled
  if (new_title === null)
    return

  let new_description = prompt('Update Description', description)

  // return if new 
  if (new_description === null || (title === new_title && description === new_description))
    return





  const body = {
    'title': new_title,
    'description': new_description
  }

  const data = await fetch(`${ROOT_URI}/api/required_file/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => {
    if (resp.status === 200) {
      displayAlert('Record updated successfully', 'alert-success')
      getFiles(document.currentTab)
    }
    else
      displayAlert(data.msg, 'alert-danger');
  })


}
