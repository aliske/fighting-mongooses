
async function deleteFile(uuid){
  let uri
  if (document.currentTab === 'required_files')
    uri = `${ROOT_URI}/api/required_file/${uuid}`
  else if (document.currentTab === 'public_files')
    uri = `${ROOT_URI}/api/file/${uuid}`



  await fetch(uri, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(async resp => { 
      if (resp.status === 200) {
        getFiles(document.currentTab)
        displayAlert('File deleted successfully', 'alert-success')
      }
      else {
        const data = await resp.json()
        
        displayAlert(data.msg, 'alert-danger');
      }
    })
    .catch(err => {
      displayAlert("No connection, please sign in again if needed", 'alert-danger');
    })
}

