async function updateStudent(){
  const id= $('#id').val()
  const fname = $('#fname').val();
  const lname = $('#lname').val();
  const email = $('#email').val();
  const addr_line1 = $('#addr_line1').val();
  const addr_line2 = $('#addr_line2').val();
  const addr_city = $('#addr_city').val();
  const addr_state = $('#addr_state').val();
  const addr_zip = $('#addr_zip').val();
  const birthdate = $('#birthdate').val();
  const school = $('#school').val();
  const grade = $('#grade').val();

// VALIDATE USER INPUT HERE


const body = {
  'fname' : fname,
  'lname': lname,
  'email': email,
  'addr_line1': addr_line1,
  'addr_line2': addr_line2,
  'addr_city': addr_city,
  'addr_state': addr_state,
  'addr_zip': addr_zip,
  'birthdate': birthdate,
  'school': school,
  'grade': grade
}

const data = await fetch(`${ROOT_URI}/api/users/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
.then(resp => {
  if (resp.status === 200) {
    alert('Student record updated successfully!')
  }
  else
    alert(data.msg);
})
}