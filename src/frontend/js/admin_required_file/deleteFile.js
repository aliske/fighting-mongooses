
async function deleteFile(uuid){
  const data = await fetch(`${ROOT_URI}/api/required_file/${uuid}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(resp => { 
      if (resp.status === 200) {
        displayAlert('record deleted successfully', 'alert-success')
        getFiles()
      }
      else
        displayAlert('Error deleting file', 'alert-danger');
    })
}

