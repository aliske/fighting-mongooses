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
      'internal_name': 'public',
      'display_name': 'public?'
    },
    {
      'internal_name': 'cdate',
      'display_name': 'Date'
    }
  ]
  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = `<tr>${headers_HTML}</tr>`

  let data_HTML = data.map(row => {
    const row_data = headers.map(header => {
      // defaults to '' if null
      return `<td>${row[header.internal_name] || ''}</td>` 
    }).join('')

    return `<tr>${row_data}<td class='delete-icon' onclick='deleteAnnouncement(${row['id']})'>&times;</td></tr>`
  }).join('') 

  console.log(data_HTML)


  $('#uploads-table').html(headers_HTML + data_HTML)
  
}
