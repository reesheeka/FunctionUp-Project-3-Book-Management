const express = require('express');
const userController=require('../controllers/userController')
const router = express.Router();


router.post('/register',userController.createUser)

router.post('/login',)

router.post('/books',)

router.get('/books',)


router.all('/*', function (req, res) {
    res.status(404).send({ message: 'Invalid HTTP Request' })
})

module.exports = router;