const jwt = require("jsonwebtoken");

const authenticate = (request, response, next) => {
  const token = request.headers?.authorization?.spli(" ")[1];
  if (token) {
    const decoded = jwt.verify(token, "hush");
    if (decoded) {
      const userID = decoded.userID;
      request.body.userID = userID;
      next();
    } else {
      response.send("Please login");
    }
  } else {
    response.send("Please login");
  }
};

module.exports = { authenticate };
