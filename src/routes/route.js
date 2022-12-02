const express = require('express');
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')

const MW = require('../middlewares/middleware')
const router = express.Router();


router.post('/register', userController.createUser)

router.post('/login', userController.createLogin)

router.post('/books', MW.authentication, MW.authorisation, bookController.createBook)

router.get('/books', MW.authentication, bookController.getBooks)

router.get('/books/:bookId', MW.authentication, bookController.getBookById)

router.put('/books/:bookId', MW.authentication, MW.authorisation, bookController.updateBookById)

router.delete('/books/:bookId', MW.authentication, MW.authorisation, bookController.deleteBookById)

router.post('/books/:bookId/review', reviewController.createReview)


router.all('/*', function (req, res) {
    res.status(404).send({ status: false, message: 'Invalid HTTP Request' })
})



module.exports = router;