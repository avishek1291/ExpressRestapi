
module.exports = function(options) {
    return function(err,req, res, next) {
        console.log('custom error handler')
     // res.json('invalid url err')
      next('abc')
    }
  }