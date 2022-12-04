const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const reviewController = require('../controllers/reviewController');
const MW = require('../middlewares/middleware');


router.post('/register', userController.createUser)

router.post('/login', userController.createLogin)

router.post('/books', MW.authentication, MW.authorisation, bookController.createBook);

router.get('/books', MW.authentication, bookController.getBooks);

router.get('/books/:bookId', MW.authentication, bookController.getBookById);

router.put('/books/:bookId', MW.authentication, MW.authorisation, bookController.updateBookById);

router.delete('/books/:bookId', MW.authentication, MW.authorisation, bookController.deleteBookById);

router.post("/books/:bookId/review", reviewController.createReview);

router.put('/books/:bookId/review/:reviewId', reviewController.updatereviewBookById);

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteBookReview);


router.all('/*', function (req, res) {
    res.status(400).send({ status: false, message: 'Invalid HTTP Request' });
})


module.exports = router;