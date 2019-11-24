async function getUsers(users_table) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/users/`)
                  .then(resp => { return resp.json() })


  const headers = [
  {
      'internal_name': 'fname',
      'display_name': 'First Name'
    },
	{
      'internal_name': 'lname',
      'display_name': 'Last Name'
    },
    {
      'internal_name': 'registered',
      'display_name': 'Registered?'
    }
  ]


  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = `<tr>${headers_HTML}</tr>`


  let data_HTML = data.map(row => {
    const row_data = headers.map(header => {
      // defaults to '' if null
      return `<td>${row[header.internal_name] || ''}</td>` 
    }).join('')

    return `<tr>${row_data}<td class='delete-icon' onclick='deleteUser(${row['id']})'>&times;</td></tr>`
  }).join('') 

  $('#' + users_table).html(headers_HTML + data_HTML)

}