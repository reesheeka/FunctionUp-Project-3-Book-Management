const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const validator =require('../validators/validator');
function stringVerify(value) {
    if (typeof value !== "string" || value.trim().length == 0) {
        return false
    }
    return true
}
let {isValidName,isValidEmail,isValidPhone,isValidPassword,isValidPinCode,isValidCity } = validator;


//=============Create User===============
const createUser = async function (req, res) {
    try {
        let user = req.body
        //not sending any data
        if (Object.keys(user).length == 0) {
            return res.status(400).send({ status: false, message: "please enter user details" })
        }
        const arr = ["title", "name", "phone", "email", "password"]
        //   for(let field of arr){
        //     if (!user[field]) {
        //         return res.status(400).send({ status: false, message:  `${field} is required`})
        //     }
        //   }

        let { title, name, phone, email, password, address } = user
        if (!title) {
            return res.status(400).send({ status: false, message: "title is required" })
        }

        if (!name) {
            return res.status(400).send({ status: false, message: "user name is required" })
        }

        if (!stringVerify(name)) {
            return res.status(400).send({ status: false, msg: "Name should not have space" })
        }

        if(!isValidName(name)) {
            return res.status(400).send({ status: false, msg:" Name should contain alphabet only "});
        }

        // if (name.indexOf(" ") >= 0) {
        //     return res.status(400).send({ status: false, msg: "Name should not have space" })
        // }

        if (!phone) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }

        if(!isValidPhone()) {
            return res.status(400).send({ status: false, msg:"Phone must contains 10 digits only" });
        }
        

        let checkphone = await userModel.findOne({ phone: user.phone })
        if (checkphone) {
            return res.status(400).send({ status: false, message: "phone number is already taken" })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "Email is required." })
        }

        if(!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Email must be in correct format"});
        }

        let checkEmail = await userModel.findOne({ email: user.email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "Email is already taken, Please provide another email." })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "Password is required." })
        }

        if(!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Password must contain atleast 8 characters including one upperCase, lowerCase, special characters and Numbers"});
        }

        if (!address) {
            return res.status(400).send({ status: false, message: "Address is required." })
        }

        let { street, city, pincode } = address;
        if (!street || street.length == 0) {
            return res.status(400).send({ status: false, message: "Please enter a valid street" });
        }

        if (!city || city.length == 0) {
            return res.status(400).send({ status: false, message: "Please enter a valid city" });
        }

        if (!pincode || pincode.length == 0) {
            return res.status(400).send({ status: false, message: "Please enter a valid pincode" });
        }
 
        if(!isValidCity()) {
            return res.status(400).send({ status: false, msg:"City should contain alphabet only " });
        }

        if(!isValidPinCode()) {
            return res.status(400).send({ status: false, msg:"Pincode should contain numbers only " });
        }

        const userCreated = await userModel.create(user)
        return res.status(201).send({ staus: true, message: "Success", data: userCreated })
    }
    catch (error) {
        return res.status(500).send({ staus: false, message: error.message })
    }
}


//=========================User Login ============================

const createLogin = async function (req, res) {
    try {
        let login = req.body

        if (Object.keys(login).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter login details" })
        }
        const email = req.body.email
        const password = req.body.password
        if (!email) {
            return res.status(400).send({ status: false, messsage: "Email is required " })
        }

        if (!password) {
            return res.status(400).send({ status: false, messsage: "Password is required " })
        }

        const user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(404).send({ status: false, message: "Email or Password not found" })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                iat: new Date().getTime(),

                exp: Math.floor(Date.now() / 1000) + 60 * 600
            },
            "project3group18"
        )
        return res.status(200).send({ status: true, message: "Success", token: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createUser, createLogin }
