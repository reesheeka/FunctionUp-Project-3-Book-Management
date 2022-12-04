const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const { isValidObjectId, stringVerify } = require('../validators/validator')

//------------------------Authentication------------------------------
const authentication = function (req, res, Next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, message: "Token must be present." });
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
    return res.status(500).send({ status: false, message: error.message });
  }

}


//------------------------Authorisation------------------------------

const authorisation = async function (req, res, next) {
  try {

    const decodedtoken = req.decodedToken

    const bookId = req.params.bookId

    if (bookId) {
      if (!isValidObjectId(bookId)) { return res.status(404).send({ status: false, message: "Please enter a valid book id." }); }

      const paramBookId = await bookModel.findById({ _id:bookId })
      if (!paramBookId) { return res.status(404).send({ status: false, message: "Book Not Found" }); }

  

      const userId = paramBookId.userId

      const loginId = decodedtoken.userId

      if (loginId != userId) return res.status(403).send({ status: false, message: "You are not authorised to perform this task 1." });
    }
    else {
      const data = req.body

      if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter book details." }); }

      updatedbookId = req.body.userId
      
      let loginId = decodedtoken.userId
     
      if (!updatedbookId) { return res.status(400).send({ status: false, message: "UserId is required." }); }
      if (!stringVerify(updatedbookId)) { return res.status(400).send({ status: false, message: "UserId should be of type String." }) }

      if(!isValidObjectId(updatedbookId)){return res.status(400).send({ status: false, message: "Please enter a valid userId." })}



      if (loginId != updatedbookId) return res.status(403).send({ status: false, message: 'You are not authorised to perform this task 2.' });
    }
    next()

  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = { authentication, authorisation }