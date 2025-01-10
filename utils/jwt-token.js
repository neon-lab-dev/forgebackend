// Create Token and saving in cookie

/**
 * Sends a JWT token to the client via a cookie and responds with user data.
 *
 * @param {Object} user - The user object containing user details and methods.
 * @param {number} statusCode - The HTTP status code to send in the response.
 * @param {Object} res - The Express response object.
 * @param {string} message - A message to include in the response.
 * @param {string} tokenKey - The key name for the token cookie.
 */
const sendToken = (user, statusCode, res, message, tokenKey) => {
  const token = user.getJWTToken();

  //option for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  const userData = {
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,


  };

  res.status(statusCode).cookie(tokenKey, token, options).json({
    success: true,
    message,
    user: userData,
  });
};

export default sendToken;