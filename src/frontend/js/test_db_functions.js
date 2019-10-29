async function buildDB(){
  const data = await fetch(`${ROOT_URI}/api/test_db_functions/build`)
  .then(resp => { return resp.json() })
  .then(data => { return data })

  getUsers()
  displayAlert(data.msg, 'alert-success');
}
async function seedDB(){
  const data = await fetch(`${ROOT_URI}/api/test_db_functions/seed`)
  .then(resp => { return resp.json() })
  .then(data => { return data })

  // $('#alert_text').html(data.msg)
  // $('.alert').addClass('show alert-warning')
  // setTimeout(() => {$('.alert').removeClass('show alert-warning')}, 2000);
  getUsers()
  displayAlert(data.msg, 'alert-warning');

}
async function destroyDB() {
  const data = await fetch(`${ROOT_URI}/api/test_db_functions/destroy`)
  .then(resp => { return resp.json() })
  .then(data => { return data })

  $('#users_table').html('')
  displayAlert(data.msg, 'alert-danger');
}