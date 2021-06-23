module.exports = {
  frontend: () => {
    if (process.env.NODE_ENV === 'production')
      return 'http://localhost:3400/api/v1/'
    else
      return 'http://localhost:3400/api/v1/'
  }
}