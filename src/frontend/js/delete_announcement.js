async function deleteAnnouncement(id){
const data = await fetch(`${ROOT_URI}/api/announcements/${id}`, {
  method: 'DELETE'
})
  .then(resp => { 
    if (resp.status === 200) {
      displayAlert('record deleted successfully', 'alert-success')
      getUsers()
    }
    else
    displayAlert(data.msg, 'alert-danger');
  })
}