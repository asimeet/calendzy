const config = require('../config');
const jwt = require('jsonwebtoken');
let accessCookie = (cookieString, cookieName) => {
  var name = cookieName + "=";
  var allCookieArray = cookieString.split(';');
  for (var i = 0; i < allCookieArray.length; i++) {
    var temp = allCookieArray[i].trim();
    if (temp.indexOf(name) == 0)
      return temp.substring(name.length, temp.length);
  }
  return "";
}
module.exports = {
  verifyToken: (req, res, next) => {
    let init = (req.baseUrl == '' ? true : false);
    var token = req.headers['x-access-token'];

    if (!token) {
      token = accessCookie(req.headers['cookie'], 'auth-token');
    }

    if (!token && !init) {
      return res.status(403).send({
        auth: false,
        message: 'No token provided.'
      });
    }

    jwt.verify(token, config.secret, function (err, decoded) {
      if (err && !init){
    
        return res.status(500).send({
          auth: false,
          message: 'Failed to authenticate token.'
        });
      }
      if(decoded){
        req.userId = decoded.id;
      }
      next();
    });
  }

}