
// validate user has permissions
// to the resource they are trying to access
module.exports.validate_user_permissions = (req, res, next) => {
  // = req.session.user
  const valid_user = true
  if (!valid_user) {
    res.send('FAILED')
  } else {
    // valid user - continue flow
    next()
  }
}

