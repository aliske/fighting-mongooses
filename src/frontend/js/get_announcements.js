async function getAnnouncements(announcements_table) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/announcements/`)
                  .then(resp => { return resp.json() })


  const headers = [
  {
      'internal_name': 'author',
      'display_name': 'Author'
    },
    {
      'internal_name': 'title',
      'display_name': 'Title'
    },
    {
      'internal_name': 'announcement',
      'display_name': 'Announcement'
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

  $('#' + announcements_table).html(headers_HTML + data_HTML)

}