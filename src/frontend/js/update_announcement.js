async function updateAnnouncement(){
  const id= $('#edit-id').val()
  const title = $('#edit-title').val()
  const announcement = $('#edit-announcement').val()

// VALIDATE USER INPUT HERE


const body = {
  'id' : id,
  'title': title,
  'announcement': announcement
}

const data = await fetch(`${ROOT_URI}/api/announcements/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
.then(resp => { 
  if (resp.status === 200) {
    //alert('record updated successfully')
  }
  else 
    alert(data.msg);
})
}