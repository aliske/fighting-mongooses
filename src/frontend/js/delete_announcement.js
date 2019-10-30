async function deleteAnnouncement(id){
const data = await fetch(`${ROOT_URI}/api/announcements/${id}`, {
  method: 'DELETE'
})
  .then(resp => { 
    if (resp.status === 200) {
      alert('record deleted successfully')
    }
    else
    alert(data.msg);
  })
}