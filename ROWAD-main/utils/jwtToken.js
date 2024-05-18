// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const cookieOptions = {
    domain: "localhost",       // Domain where the cookie is accessible
    path: "/api/v1",          // Path within the domain where the cookie is accessible
    httpOnly: true,           // Limit the cookie to be accessible only through HTTP
    sameSite: 'None',         // Allow cross-origin cookies (if applicable)
};

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;