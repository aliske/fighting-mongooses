async function insertUser(){
  const name = $('#name').val()
  const age = $('#age').val()
  const bio = $('#bio').val()

// VALIDATE USER INPUT HERE


const body = {
  'name': name,
  'age': age,
  'bio': bio
}

const data = await fetch(`${ROOT_URI}/api/users`, {
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