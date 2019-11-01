

function validate_user(req, res, next) {
  // = req.session.user
  const valid_user = true
  if (!valid_user) {
    res.send('FAILED')
  } else {
    // valid user - continue flow
    next()
  }
}



module.exports = {
  validate_user: validate_user
}
