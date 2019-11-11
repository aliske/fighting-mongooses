
async function deleteFile(uuid){
  await fetch(`${ROOT_URI}/api/required_file/${uuid}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(async resp => { 
      if (resp.status === 200) {
        getFiles()
        displayAlert('File deleted successfully', 'alert-success')
      }
      else {
        const data = await resp.json()
        console.log(data)
        
        displayAlert(data.msg, 'alert-danger');
      }
    })
}

