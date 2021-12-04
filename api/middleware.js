// https://github.com/typicode/json-server#getting-started
module.exports = (req, res, next) => {
  console.log(req.params)
  next()
}