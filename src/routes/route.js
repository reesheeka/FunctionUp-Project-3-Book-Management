const express = require('express');
const userController=require('../controllers/userController')
const bookController=require('../controllers/bookController')

const middleware=require('../middlewares/middleware')
const router = express.Router();


router.post('/register',userController.createUser)

router.post('/login',userController.createLogin)

router.post('/books',bookController.createBook)

router.get('/books',)


router.all('/*', function (req, res) {
    res.status(404).send({ message: 'Invalid HTTP Request' })
})

module.exports = router;