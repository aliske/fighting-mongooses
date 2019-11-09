
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

module.exports.checkLogin = (req, res, next) => {
  //console.log(req.session)
    console.log('query from user: ' + req.session.user)

    if (req.session.user != null) {
      //res.json({'msg': req.session.name + ' Logged In'})
      next()
    } else {
      res.status(502).json({'msg':'You are not logged in'})
    }
}


module.exports.isAdmin = (req, res, next) => {
  //console.log(req.session)

    if (req.session.type === 'Admin') {
      //res.json({'msg': req.session.name + ' Logged In'})
      next()
    } else {
      res.status(502).json({'msg':'You are not logged in as an admin'})
    }
}
