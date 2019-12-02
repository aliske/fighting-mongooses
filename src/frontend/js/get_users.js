async function getUsers(users_table, type) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/users/`)
                  .then(resp => { return resp.json() })


  const headers = [
  {
      'internal_name': 'fname',
      'display_name': 'First Name'
    },
	{
      'internal_name': 'lname',
      'display_name': 'Last Name'
    },
	{
      'internal_name': 'id',
      'display_name': 'ID'
    },
    {
      'internal_name': 'registered',
      'display_name': 'Registered?'
    }
  ]


  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = `<tr>${headers_HTML}</tr>`


  let data_HTML = data.map(row => {
    const row_data = headers.map(header => {
      // defaults to '' if null
      return `<td>${row[header.internal_name] || ''}</td>` 
    }).join('')

    return `<tr>${row_data}<td><button class='enroll_student_button' onclick='enroll_student(${row['id']})'>Enroll</button><button class='unenroll_student' onclick='unenroll_student(${row['id']})'>Unenroll</button></td></tr>`
  }).join('') 

  $('#' + users_table).html(headers_HTML + data_HTML)

}

async function getStudents(users_table) {
  // raw query
    data = await fetch(`${ROOT_URI}/api/users/byType/student`)
              .then(resp => { return resp.json() })


  const headers = [
  {
      'internal_name': 'fname',
      'display_name': 'First Name'
    },
	{
      'internal_name': 'lname',
      'display_name': 'Last Name'
    }
  ]


  let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
  headers_HTML = `<tr>${headers_HTML}</tr>`


  let data_HTML = data.map(row => {
    const row_data = headers.map(header => {
      // defaults to '' if null
      return `<td>${row[header.internal_name] || ''}</td>`
    }).join('')

    return `<tr>${row_data}<td><button class='unenroll_student' onclick='showStudentRecord(${row['id']})'>Get Record</button></td></tr>`
  }).join('')

  $('#' + users_table).html(headers_HTML + data_HTML)

}

async function getUserRecord(user){
    const data = await fetch(`${ROOT_URI}/api/users/${user}`)
                    .then(resp => { return resp.json() })

    $('#student-record-title').html("Student Record for " + data[0]['fname'] + " " + data[0]['lname'])
    $("#id").val(data[0]['id']);
    $("#fname").val(data[0]['fname']);
    $("#lname").val(data[0]['lname']);
    $("#email").val(data[0]['email']);
    $("#addr_line1").val(data[0]['addr_line1']);
    $("#addr_line2").val(data[0]['addr_line2']);
    $("#addr_city").val(data[0]['addr_city']);
    $("#addr_state").val(data[0]['addr_state']);
    $("#addr_zip").val(data[0]['addr_zip']);
    $("#birthdate").val(data[0]['birthdate']);
    $("#school").val(data[0]['school']);
    $("#grade").val(data[0]['grade']);
}