async function getUploads(public = true) {
  let uri;
  if (public === true)
    uri = `${ROOT_URI}/api/file/public`
  else
    uri = `${ROOT_URI}/api/file/me`

  // raw query

  populateRequiredFileDropdown()
  populateFltrDropdown()

  const data = await fetch(uri, { credentials: 'include' })
                  .then(resp => { return resp.json() })
                  .catch(er => displayAlert('Failed to connect', 'alert-danger'))
                  
  //              data = data.filter(row => { return row['requiredfile'] === '' }) 

  const headers = [
    {
      'internal_name': 'user',
      'display_name': 'Author'
    },
 //   {
 //     'internal_name': 'uuid',
 //     'display_name': 'uuid'
 //   },
    // {
    //   'internal_name': 'filename',
    //   'display_name': 'Title'
    // },
 //   {
 //     'internal_name': 'public',
 //     'display_name': 'public?'
 //   },
    {
      'internal_name': 'requiredfile',
      'display_name': 'required File'
    },
    {
      'internal_name': 'cdate',
      'display_name': 'Created Date'
    }
  ]
  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = `<tr>${headers_HTML}<th>View</th><th>Delete</th><th>Download <input type="checkbox" onclick="checkAll(this)"></th></tr>`

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
      <td>
        <input type="checkbox" class='download.checkbox' name=checkbox.${row['uuid']} >
      </td>
    </tr>`
  }).join('') 

//  console.log('update table')
  $('#uploads-table').html(headers_HTML + data_HTML)
}



async function deleteUpload(uuid){
  await fetch(`${ROOT_URI}/api/file/${uuid}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(async resp => {

      if (resp.status === 200) {
        getUploads(false)
        displayAlert('File deleted successfully', 'alert-success')
      }
      else {
        const data = await resp.json()
        displayAlert(data.msg, 'alert-danger');
      }
    })
    .catch(err => {
      displayAlert("No connection, please sign in again if needed", 'alert-danger');
    })

}
    async function checkAll(bx) {
    var cbs = document.getElementsByClassName('download.checkbox');
    for(var i=0; i < cbs.length; i++) {
      if(cbs[i].type == 'checkbox') {
        cbs[i].checked = bx.checked;
        }
      }
   }