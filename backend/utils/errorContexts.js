const errorContexts = {
  'authorization failure': {
    code: 401,
    message: `Authorization Failed. Please log in.`
  },
  'invalid parameters': {
    code: 400,
    message: `Request's parameter is invalid due to either its format or content.`
  },
  'resource not found': {
    code: 404,
    message: 'Resource not found.'
  },
  'network trouble': {
    code: 500,
    message: `Possible to be web server's error happened.`
  }
}

module.exports = errorContexts