const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const { isValidObjectId } = require('mongoose');


//---------------------CREATE BOOK--------------------------
const createBook = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter book details." })
        }

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!title) {
            return res.status(400).send({ status: false, message: "Title is required." })
        }

        const checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "Title already used, Please provide another title." })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, message: "Excerpt is required." })
        }

        if (!userId) {
            return res.status(400).send({ status: false, message: "UserId is required." })
        }

        const checkUserId = await userModel.findById(userId)

        if (!checkUserId) {
            return res.status(404).send({ status: false, message: "UserId not found." })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please enter valid userId." })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required." })
        }
        const checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({ status: false, message: "ISBN already used, Please provide another ISBN." })
        }

        if (!category) {
            return res.status(400).send({ status: false, message: "Category is required." })
        }

        if (!subcategory) {
            return res.status(400).send({ status: false, message: "Subcategory is required." })
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "ReleasedAt is required." })
        }

        let book = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: book })
    }
    catch (error) {
        return res.status(500).send({ staus: false, message: error.message })
    }
}

//--------------------------------GET BOOK-------------------------------

const getBooks = async function (req, res) {
    try {
        const data = req.query

        const books = await bookModel.find({ $and: [data, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 }).collation({ locale: "en" }).sort({ title: 1 })

        if (books.length == 0) {
            return res.status(404).send({ status: false, message: "No books Available." });
        }
        return res.status(200).send({ status: true, message: 'Success', count: books.length, data: books });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//-------------------------------GET BOOK BY ID-------------------------------

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please provide a valid book id." })
        }

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (bookData) {
            return res.status(200).send({ status: true, message: "Success", data: bookData })
        } else {
            return res.status(400).send({ status: false, message: "No books found with this id." })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//-------------------------------UPDATE BOOK BY ID---------------------------------


const updateBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        let data = req.body

        if (!isValidObjectId(bookId)) {
            return res.status(404).send({ status: false, message: "Please enter a valid book id." })
        }

        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!existBook) {
            return res.status(404).send({ status: false, message: " No book found with given id." })
        }

        const updateData = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { ...data } }, { new: true, upsert: true })
        // $set: { title: Data.title, excerpt: Data.excerpt, releaseAt: Data.releaseAt, ISBN: Data.ISBN },
        return res.status(200).send({ status: true, message: "Success", data: updateData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//-------------------------------DELETE BOOK BY ID-------------------------------

const deleteBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please provide a valid book Id." })
        }

        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true } })

        return res.status(200).send({ status: true, message: "Successfully deleted." })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createBook, getBooks, getBookById, deleteBookById, updateBookById }