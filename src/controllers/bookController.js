const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const { isValidObjectId } = require('mongoose');

function stringVerify(value) {
    if (typeof value === 'undefined' || value === null) {
        return false
    }
    if (typeof value === 'string' && value.trim().length === 0) {
        return false
    } else {
        return true
    }
}

const createBook = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter book details" })
        }

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!title) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }

        const checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "Title already used, Please provide another title" })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, message: "Excerpt is required" })
        }

        if (!userId) {
            return res.status(400).send({ status: false, message: "UserId is required" })
        }

        const checkUserId = await userModel.findById(userId)

        if (!checkUserId) {
            return res.status(404).send({ status: false, message: "UserId not found" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please enter valid userId" })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required" })
        }
        const checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({ status: false, message: "ISBN already used, Please provide another ISBN" })
        }

        if (!category) {
            return res.status(400).send({ status: false, message: "Category is required" })
        }

        if (!subcategory) {
            return res.status(400).send({ status: false, message: "Subcategory is required" })
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "ReleasedAt is required" })
        }

        let book = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: book })
    }
    catch (err) {
        return res.status(500).send({ staus: false, message: err.message })
    }
}

// const getBook = async function (req, res) {
//     const { userId, category, subcategory } = req.query
//     const allBooks = await bookModel.find({ book: book, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
//     return res.status(200).send({ status: true, message: 'Success', data: allBooks })
// }



module.exports = { createBook }