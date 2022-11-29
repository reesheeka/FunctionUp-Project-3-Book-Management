const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");

//------------------------Authentication------------------------------
const authentication = function (req, res, Next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, message: "Token must be present" });
    }

    jwt.verify(token, 'project3group18', function (error, decoded) { //callback function

      if (error) {
        return res.status(401).send({ status: false, message: error.message });
      }
      else {
        req.decodedToken = decoded
        Next()
      }
    })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}


//------------------------Authorisation------------------------------

const authorisation = async function (req, res, next) {
  try {
    // const decoded = req.decodedtoken
    let token = req.headers["x-api-key"]

    let decodedtoken = jwt.verify(token, "project3group18")

    let updatedbookId = req.params.bookId
    if (updatedbookId) {

      let updatinguserId = await bookModel.find({ _id: updatedbookId }).select({ userId: 1, _id: 0 })

      let userId = updatinguserId.map(x => x.userId)
      console.log(userId)
      let id = decodedtoken.userId
      if (id != userId) return res.status(403).send({ status: false, message: "You are not authorised to perform this task 1" })
    }
    else {
      updatedbookId = req.body.userId
      let id = decodedtoken.userId
      console.log(updatedbookId)

      if (id != updatedbookId) return res.status(403).send({ status: false, message: 'You are not authorised to perform this task 2' })
    }

    next();
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { authentication, authorisation }