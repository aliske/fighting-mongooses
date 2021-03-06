
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


  if (req.session.user != null) {
    //res.json({'msg': req.session.name + ' Logged In'})
    next()
  } else {
    res.status(502).json({'msg':'You are not logged in'})
  }
}


module.exports.isAdmin = (req, res, next) => {


  if (req.session.userType === 'Admin') {
    //res.json({'msg': req.session.name + ' Logged In'})
    next()
  } else {
    res.status(502).json({'msg':'You are not logged in as an admin'})
  }
}



module.exports.isParent = (req, res, next) => {


  if (req.session.userType === 'Parent') {
    //res.json({'msg': req.session.name + ' Logged In'})
    next()
  } else {
    res.status(502).json({'msg':'You are not logged in as a parent'})
  }
}



module.exports.isStudent = (req, res, next) => {


  if (req.session.userType === 'Student') {
    //res.json({'msg': req.session.name + ' Logged In'})
    next()
  } else {
    res.status(502).json({'msg':'You are not logged in as a student'})
  }
}
