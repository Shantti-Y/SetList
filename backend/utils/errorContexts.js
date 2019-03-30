const errorContexts = {
  '401': {
    status: 401,
    statusText: 'Unauthorized',
    message: `Authorization Failed. Please log in.`
  },
  '400': {
    status: 400,
    statusText: 'Bad Request',
    message: `Request's parameter is invalid due to either its format or content.`
  },
  '404': {
    status: 404,
    statusText: 'Not Found',
    message: 'Resource not found.'
  },
  '500': {
    status: 500,
    statusText: 'Internal Server Error',
    message: `Possible to be web server's error happened.`
  }
}

const transmitErrorContext = status => {
  throw errorContexts[status.toString()];
}

module.exports = { errorContexts, transmitErrorContext }