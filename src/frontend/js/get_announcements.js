async function getAnnouncements(page) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/announcements/`)
                  .then(resp => { return resp.json() })

  
  if(page == "db_test")
  {
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

    $('#announcements_table').html(headers_HTML + data_HTML)

  } else if(page == "announcements")
  {
    const headers = [
      {
        'internal_name': 'id',
        'display_name': 'ID'
      },
      {
        'internal_name': 'title',
        'display_name': 'Title'
      },
      {
        'internal_name': 'announcement',
        'display_name': 'Announcement'
      },
      {
        'internal_name': 'cdate',
        'display_name': 'Date'
      }
    ]
    let data_HTML = data.map(row => {
      const row_data = headers.map(header => {
        // defaults to '' if null
        return `<td class="td-other">${row[header.internal_name] || ''}</td>` 
      }).join('')

      return `<tr>${row_data}<td class="td-other"><button class='btn btn-primary' id='edit-btn' onclick='showEditCard(this)'>Edit</button></td><td class='td-other'><button class='btn btn-danger' id='delete-btn' onclick='removeAnnouncement(${row['id']})'>Delete</button></td></tr>`
    }).join('') 

    $('#announcement-tbody').html(data_HTML)
  }
}