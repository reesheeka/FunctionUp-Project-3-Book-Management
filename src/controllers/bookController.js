const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const userModel = require("../models/userModel");
const { isValidObjectId } = require('mongoose');
const validator =require('../validators/validator');
function stringVerify(value) {
    if (typeof value !== "string" || value.trim().length == 0) {
        return false
    }
    return true
}

function checkDate(str) {
    var re = /^(18|19|20)[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    return re.test(str);
}


//---------------------CREATE BOOK--------------------------
const createBook = async function (req, res) {
    try {
        let data = req.body


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

        if (!(/^[a-zA-Z ]+$/.test(excerpt))) {
            return res.status(400).send({ status: false, message: "Excerpt should be in alphabets" });
        }

        if (!stringVerify(excerpt)) {
            return res.status(400).send({ status: false, msg: "Excerpt should not have space" })
        }

        if (!userId) {
            return res.status(400).send({ status: false, message: "UserId is required." })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required." })
        }

        if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {

            return res.status(400).send({ status: false, message: "ISBN should be in correct format " })
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
        }//regex

        if (!checkDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Please enter a valid date format" })
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

        const { userId, category, subcategory } = req.query

        if (Object.keys(req.query).length > 0) {
            if (req.query.userId === "") { return res.status(400).send({ status: false, message: "Enter value in userId" }); }
            if (userId) {
                if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Enter a valid user id" }); }
            }

            if (req.query.category === "") { return res.status(400).send({ status: false, message: "Enter value in category" }); }

            if (req.query.subcategory === "") { return res.status(400).send({ status: false, message: "Enter value in subcategory" }); }

            let getbooks = await bookModel.find({$and: [req.query, { isDeleted: false }]}).sort({ title: 1 }).select({ __v: 0, createdAt: 0, updatedAt: 0 });
            
            if (getbooks.length == 0) {
                return res.status(404).send({ status: false, message: "No books found" });
            }
            return res.status(200).send({ status: true, message: "Books list", data: getbooks });
        }

        const getAllBooks = await bookModel.find({ isDeleted: false }).sort({ title: 1 }).select({  __v: 0, createdAt: 0, updatedAt: 0 });

        if (getAllBooks.length == 0) {
            return res.status(404).send({ status: false, message: "No books found" });
        }
        return res.status(200).send({ status: true, message: "Books list", count: getAllBooks.length, data: getAllBooks });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//-------------------------------GET BOOK BY ID-------------------------------

const getBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
       
        if (!isValidObjectId(bookId)) {return res.status(400).send({ status: false, message: "Please provide a valid book id." });}

        const bookData = await bookModel.findOne({ id: bookId, isDeleted: false }).select({ "ISBN": 0, "isDeleted": 0, "subcategory": 0, "_v": 0, "createdAt": 0, "updatedAt": 0 }).lean()

        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v:0 })
        
        bookData.reviewsData = reviewsData
        
        if (bookData) {
            return res.status(200).send({ status: true, message: "Books List", data: bookData })
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
        let bookId = req.params.bookId;
        const data = req.body;


        const check = await bookModel.findOne({ title: data.title})
        if (check) {
            return res.status(400).send({ status: false, message: "Title is already present" })
        }

        const ISBN = await bookModel.findOne({ ISBN: data.ISBN})
        if (ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already present" })
        }

        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!existBook) {
            return res.status(404).send({ status: false, message: " No book found with given id." })
        }


        const updateData = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { ...data } }, { new: true })
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

        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true } })

        return res.status(200).send({ status: true, message: "Successfully deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createBook, getBooks, getBookById, deleteBookById, updateBookById }