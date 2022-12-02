const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const { isValidObjectId } = require("mongoose");

const createReview = async function (req, res) {

    const bookId = req.params.bookId
    // if(!bookId){
    //     return res.status(400).send({ status: false, message: "BookId is required in params" })
    // }
    if (bookId) {
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter valid bookId." })
        }
    }
    const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!checkBook) {
        return res.status(400).send({ status: false, message: "Book not found or already deleted." })
    }

    const data = req.body
    if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: "Please enter book details." })
    }

    const { rating, reviewedAt, reviewedBy } = data

    if (!reviewedBy) {
        return res.status(400).send({ status: false, message: "ReviewedBy is required." })
    }
    if (!reviewedAt) {
        return res.status(400).send({ status: false, message: "ReviewedAt is required." })
    }
    if (!rating) {
        return res.status(400).send({ status: false, message: "Rating is required." })
    }
    // const date = moment.format()
    // data.reviewedAt = date

    //data.bookId = bookId

    const reviewData = await reviewModel.create(data, { bookId: bookId })

    return res.status(201).send({ status: true, message: "Success", data: reviewData })
}


const updateBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) {
            return res.status(404).send({ status: false, message: "Please enter a valid book id." })
        }

        const data = req.body
        const date = moment().format()

        const existBook = await reviewModel.findOne({ _id: bookId, isDeleted: false })

        if (!existBook) {
            return res.status(404).send({ status: false, message: " No book found with given id." })
        }

        const updateReview = await reviewModel.findByIdAndUpdate({ _id: bookId }, { $set: { ...data, reviewedAt: date } }, { new: true, upsert: true })

        return res.status(200).send({ status: true, message: "Success", data: updateReview })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const deleteBookReview = async function (req, res) {
    try {

        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Please enter valid bookId" })

        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ deletedAt: 0 })
        if (!bookExist) return res.status(404).send({ status: false, message: "Book not found" });



        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "enter valid reviewId" })


        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!reviewExist) return res.status(404).send({ status: false, message: "Review not found...!" })

        if (reviewExist.isDeleted == true)
            return res.status(400).send({ status: false, data: "Review is already deleted" })

        await reviewModel.findOneAndUpdate(
            { _id: reviewId, bookId: bookId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true }
        );
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
        return res.status(200).send({ status: true, message: "Deleted succesfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}

module.exports = { createReview, updateBookById, deleteBookReview }