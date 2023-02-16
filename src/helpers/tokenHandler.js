import jwt from 'jsonwebtoken'

// Generate JSON web token based on user info
export function generateToken(user) {
  let u = {
    _id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    birthday: user.birthday,
    subscribed: user.subscribed,
    role: user.role
  }

  return jwt.sign(u, process.env.JWT_SECRET || 'secretJWT', {
    expiresIn: 60 * 60 * 24 * 7 // expires in 7 day
  })
}

// Permission Level depending on role
function getPermissionLevel(role) {
  switch (role) {
    case "Reader":
      return 0
    case "User":
      return 1
    case "Member":
      return 2
    case "Coordinator":
      return 3
    case "Staff":
      return 4
    case "Admin":
      return 5
    default:
      return 0
  }
}

// Verify JWT
export function checkPermissions(req, role) {
  let user = getUserFromToken(req)
  if (!Boolean(user)) return false
  if (getPermissionLevel(user.role) >= getPermissionLevel(role))
    return true
  return false
}

// Get user from token
export function getUserFromToken(req) {
  let authorization = req.headers.authorization.split(' ')
  if (authorization[0] !== "Bearer")
    return undefined
  return jwt.verify(authorization[1], process.env.JWT_SECRET || 'secretJWT')
}