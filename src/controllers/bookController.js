const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const { isValidObjectId } = require('mongoose');

function stringVerify(value) {
    if (typeof value !== "string" || value.trim().length == 0) {
        return false
    }
    return true
}


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
        if(!stringVerify(excerpt)){
            return res.status(400).send({ status: false, message: "Excerpt ." })
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
    

        const {category, subcategory, userId }= req.query

        // let filter = { isDeleted: false }

        // if (!userId && !category && !subcategory) {
        //     const allBook = await bookModel.find(filter);
        //     return res.status(200).send({ status: true, data: allBook });
        // }

        // if (userId) {
        //     filter.userId = userId;
        //   }
        //   if (req.query.userId) {
        //     if (!isValidObjectId(req.query.userId)) {
        //       return res
        //         .status(400)
        //         .send({ status: false, msg: "please enter a valid author id" });
        //     } else {
        //       req.query.userId = userId;
        //     }
        //   }
        //   if (!category) {
        //     return res.status(400).send({status: false, message: "Category should be present"})
        //   }
         
        //   if (subcategory) {
        //     filter.subcategory = subcategory;
        //   }

        // if(!userId){ return res.status(400).send({ status: false, msg: "UserId should be present" });}

        // if (data.userId) {
        //     if (!isValidObjectId(data.userId)) {
        //         return res.status(400).send({ status: false, message: "Please provide a valid user id." })
        //     }
        // }
        
        // if(!category){ return res.status(400).send({ status: false, msg: "Category should be present" });}
        // if(!subcategory){ return res.status(400).send({ status: false, msg: "Subcategory should be present" });}

       
      

        const books = await bookModel.find({ $and: [req.query, { isDeleted: false }] }).sort({ title: 1 }).collation({ locale: "en" }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 })

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

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ "ISBN": 0, "isDeleted": 0, "subcategory": 0, "__v": 0, "createdAt": 0, "updatedAt": 0 })

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
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) {
            return res.status(404).send({ status: false, message: "Please enter a valid book id." })
        }

        const data = req.body

        const check = await bookModel.findOne({ title: data.title, ISBN: data.ISBN })
        if (check) {
            return res.status(400).send({ status: false, message: "Title/ISBN is already present" })
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

        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true } })

        return res.status(200).send({ status: true, message: "Successfully deleted." })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createBook, getBooks, getBookById, deleteBookById, updateBookById }