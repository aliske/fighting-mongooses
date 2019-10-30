async function insertAnnouncement(){
  const title = $('#title').val()
  const announcement = $('#announcement').val()

// VALIDATE USER INPUT HERE


const body = {
  'title': title,
  'announcement': announcement
}

const data = await fetch(`${ROOT_URI}/api/announcements`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
.then(resp => { 
  if (resp.status === 200) {
    displayAlert('record inserted successfully', 'alert-success')
    getUsers()
  }
  else 
    displayAlert(data.msg, 'alert-danger');
})
}