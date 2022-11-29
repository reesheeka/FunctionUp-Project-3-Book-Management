const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");

//=============Create User===============
const createUser = async function (req, res) {
    try {
        let user = req.body
        if (Object.keys(user).length == 0) {
            return res.status(400).send({ status: false, message: "please enter user details" })
        }
      const arr=["title","name","phone","email","password"]
      for(let field of arr){
        if (!user[field]) {
            return res.status(400).send({ status: false, message:  `${field} is required`})
        }
      }
        let { title, name, phone, email, password } = user
        // if (!title) {
        //     return res.status(400).send({ status: false, message: "title is required" })
        // }

        if (title != "Mr" && title != "Mrs" && title != "Miss") {
            return res.status(400).send({ status: false, message: "title can only be mr,mrs and miss" })
        }

        // if (!name) {
        //     return res.status(400).send({ status: false, message: "user name is required" })
        // }

        if (!(/^[a-zA-Z ]+$/.test(name))) {
            return res.status(400).send({ status: false, message: "user name should be in alphabets" })
        }

        // if (!phone) {
        //     return res.status(400).send({ status: false, message: "phone number is required" })
        // }

        let checkphone = await userModel.findOne({ phone: user.phone })
        if (checkphone) {
            return res.status(400).send({ status: false, message: "phone number is already taken" })
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "enter valid phone number" })
        }

        // if (!email) {
        //     return res.status(400).send({ status: false, message: "Email is required." })
        // }

        if (!/^[a-zA-Z0-9_.+-]+@[a-z]+.[a-z]+$/.test(email)) {
            return res.status(400).send({ status: false, message: "Enter valid user's email." })
        }

        let checkEmail = await userModel.findOne({ email: user.email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "Email is already taken, Please provide another email." })
        }

        // if (!password) {
        //     return res.status(400).send({ status: false, message: "Password is required." })
        // }

        if (!/^[a-zA-Z0-9@]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "Password should be between 8 to 15 characters." })
        }
        const userCreated = await userModel.create(user)
        return res.status(201).send({ staus: true, message: "Success", data: userCreated })
    }
    catch (error) {
        return res.status(500).send({ staus: false, message: error.message })
    }
}


//-----------------------------User Login----------------------------

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
            newId: user._id,
            iat: new Date().getTime(),

            //  exp:Math.floor(Date.now()/1000)+60*2
            },
            "project3group18"
        )
        return res.status(200).send({ status: true, message: "Success", token: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {createUser, createLogin}
