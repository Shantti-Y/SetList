const isProd = () => process.env.NODE_ENV === 'production'

module.exports = {
  isProd: isProd(),
  rootUrl: isProd() ? `https://setlify-236901.appspot.com` : 'http://localhost:8080',
  apiUrl: isProd() ? `https://setlify-236901.appspot.com/api` : 'http://localhost:8080/api'
}