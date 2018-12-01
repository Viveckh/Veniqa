
export default {
  isAuthenticated(req, res, done){ 
    if (req.isAuthenticated()) {
      console.log("logged in")
      done()
    }
    else {
      return res.status(401).send('only for logged in users')
    }
  }
}