async function deleteAnnouncement(id){
const data = await fetch(`${ROOT_URI}/api/announcements/${id}`, {
  method: 'DELETE'
})
  .then(resp => { 
    if (resp.status === 200) {
      window.location.reload();
    }
    else
    alert(data.msg);
  })
}