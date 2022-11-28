const jwt= require("jsonwebtoken");
const userModel = require("../models/userModel");

//-----------------Authentication-------------------------------
const authentication = function (req, res, Next) {
  try{
  const token = req.headers["x-api-key"];
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

  jwt.verify(token, 'project3', function(err, decoded) { //callback function
    
    if(err) {return res.status(401).send({status:false,msg: err.message })}
    else{
      
      req.decodedToken = decoded
      Next() 
    } 
  
  })
} catch (err){
  return res.status(500).send({status:false,msg:err.message})
}

}

module.exports.authentication = authentication