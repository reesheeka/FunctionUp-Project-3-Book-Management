const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const validator = require('../validators/validator');
const { stringVerify, validTitle, validValue, validEmail, validPhone, validPassword, validPinCode } = validator


//---------------------------Create User--------------------------------

const createUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter user details." }) }

        let { title, name, phone, email, password, address } = data

        if (!title) { return res.status(400).send({ status: false, message: "Title is required." }) }
        if (!stringVerify(title)) { return res.status(400).send({ status: false, message: "Title should be of type String." }); }
        if (title != "Mr" && title != "Miss" && title != "Mrs") {
            return res.status(400).send({ status: false, message: "Please write title like Mr, Mrs, Miss." });
        }

        if (!name) { return res.status(400).send({ status: false, message: "User name is required." }); }
        if (!stringVerify(name)) { return res.status(400).send({ status: false, message: "Name should be of type String." }); }
        if (!validValue(name)) { return res.status(400).send({ status: false, message: " Name should contain alphabet only." }); }

        if (!phone) { return res.status(400).send({ status: false, message: "Phone number is required" }); }
        if (!stringVerify(phone)) { return res.status(400).send({ status: false, message: "Phone should be of type String." }); }
        if (!validPhone(phone)) { return res.status(400).send({ status: false, message: "Phone Number must contain 10 digits." }); }

        const checkphone = await userModel.findOne({ phone: phone })
        if (checkphone) { return res.status(400).send({ status: false, message: "Phone number is already taken,Please provide another number." }); }

        if (!email) { return res.status(400).send({ status: false, message: "Email is required." }); }
        if (!stringVerify(email)) { return res.status(400).send({ status: false, message: "Email should be of type String." }); }
        if (!validEmail(email)) { return res.status(400).send({ status: false, message: "Email must be in correct format." }); }

        const checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) { return res.status(400).send({ status: false, message: "Email is already taken, Please provide another email." }); }

        if (!password) { return res.status(400).send({ status: false, message: "Password is required." }); }
        if (!stringVerify(password)) { return res.status(400).send({ status: false, message: "Password should be of type String." }); }
        if (!validPassword(password)) { return res.status(400).send({ status: false, message: "Password must contain 8 to 15 characters including UpperCase, Special character and Number." }); }

        // if (!address) { return res.status(400).send({ status: false, message: "Address is required." }); }

        if (typeof (address) !== 'object') { return res.status(400).send({ status: false, message: "Address should be type of Object." }); }

        let { street, city, pincode } = address


        // if (!city) { return res.status(400).send({ status: false, message: "city is required." }); }
        // if (!street) { return res.status(400).send({ status: false, message: "street is required." }); }
        // if (!pincode) { return res.status(400).send({ status: false, message: "pincode is required." }); }
        if (street) {
            if (!stringVerify(street)) { return res.status(400).send({ status: false, message: "Street should be type of String." }) }
        }
        if (city) {
            if (!stringVerify(city)) { return res.status(400).send({ status: false, message: "City should be type of String." }); }
            if (!validValue(city)) { return res.status(400).send({ status: false, message: "City should contain alphabets only." }); }
        }
        if (pincode) {
            if (!stringVerify(pincode)) { return res.status(400).send({ status: false, message: "Pincode should be of type String." }); }
            if (!validPinCode(pincode)) { return res.status(400).send({ status: false, message: "Pincode should contain numbers only." }); }
        }
        
        
        if (!validTitle(street)) {return res.status(400).send({ status: false, message: "Can not have empty request for street" })}
        if (!validTitle(city)) {return res.status(400).send({ status: false, message: "Can not have empty request for city" })}
        if (!validTitle(pincode)) {return res.status(400).send({ status: false, message: "Can not have empty request for pincode" })}
        const userCreated = await userModel.create(data)
        return res.status(201).send({ staus: true, message: "Success", data: userCreated })
    }
    catch (error) {
        return res.status(500).send({ staus: false, message: error.message })
    }
}



//--------------------------------User Login------------------------------------

const createLogin = async function (req, res) {
    try {
        let login = req.body
        if (Object.keys(login).length == 0) { return res.status(400).send({ status: false, message: "Please enter login details." }); }

        const email = req.body.email
        const password = req.body.password

        if (!email) { return res.status(400).send({ status: false, messsage: "Email is required." }); }
        if (!stringVerify(email)) { return res.status(400).send({ status: false, message: "Email should be of type String." }); }

        if (!password) { return res.status(400).send({ status: false, messsage: "Password is required." }); }
        if (!stringVerify(password)) { return res.status(400).send({ status: false, message: "Password should be of type String." }); }

        const existingUser = await userModel.findOne({ email: email, password: password })
        if (!existingUser) { return res.status(404).send({ status: false, message: "Email or Password not found." }); }

        const token = jwt.sign(
            {
                userId: existingUser._id,
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
