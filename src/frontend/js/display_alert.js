var alert_close_timer
function displayAlert(msg, classes) {
  // reset alert if currently being displayed
  window.clearTimeout(alert_close_timer)
  $('.alert').removeClass('alert-success alert-warning alert-danger')

  // set alert
  $('#alert_text').html(msg)
  $('.alert').addClass(classes).show()
  alert_close_timer = setTimeout(() => {$('.alert').hide().removeClass(classes)}, 2000);
}
