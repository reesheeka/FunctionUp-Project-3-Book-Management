const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const { isValidObjectId } = require("mongoose");
const moment = require("moment")

function checkName(username) {
    var name = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
    let bool = name.test(username);
    if (bool == true) {
        username = username.trim()
        // username= username.replace(str[0], str[0].toUpperCase())
        return username
    } else { return false }
}


const createReview = async function (req, res) {

    const data = req.body
    const bookId = req.params.bookId

    if (!bookId) { return res.status(400).send({ status: false, message: "BookId is required in params" }) }

    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter book details." }) }

    const { rating, reviewedAt, reviewedBy, review } = data

    if (!rating && rating!=0) { return res.status(400).send({ status: false, message: "Rating is required." }) }
    if (!review) { return res.status(400).send({ status: false, message: "Review is required." }) }

    if (bookId) {
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter valid bookId." }) }
    }

    const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!checkBook) { return res.status(400).send({ status: false, message: "Book not found/Already deleted." }) }

    if (reviewedBy) {
        if (!checkName(reviewedBy)) { return res.status(400).send({ status: false, message: "ReviewedBy is invalid." }) }
        data.reviewedBy = checkName(reviewedBy)
    }
    if (!reviewedBy) { data.reviewedBy = "Guest" }

    if (rating < 1 || rating > 5 || typeof (rating) != "number") { return res.status(400).send({ status: false, message: "Rating must in between 1 to 5." }) }

    data.bookId = bookId
    data.reviewedAt = moment().format("YYYY-MM-DD")

    const reviewData = await reviewModel.create(data)

    let updatebookdata = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true }).lean()
    updatebookdata.reviewData = [reviewData]

    return res.status(201).send({ status: true, message: "Success", data: updatebookdata })
}


const updatereviewBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const data = req.body
        const date = moment().format()

        let { reviewedBy, rating } = data

        if (bookId) {
            if (!isValidObjectId(bookId)) { return res.status(404).send({ status: false, message: "Please enter a valid book id." }) }
        }

        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!existBook) { return res.status(404).send({ status: false, message: " No book found with given id." }) }


        if (reviewId) {
            if (!isValidObjectId(reviewId)) { return res.status(404).send({ status: false, message: "Please enter a valid reviewId id." }) }
        }

        const existreview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!existreview) { return res.status(404).send({ status: false, message: " No Review found with given Book id." }) }



        if (reviewedBy) {
            if (!checkName(reviewedBy)) { return res.status(400).send({ status: false, message: "ReviewedBy is invalid." }) }
            data.reviewedBy = checkName(reviewedBy)
        }
        if (rating) {
            if (rating < 1 || rating > 5 || typeof (rating) != "number") { return res.status(400).send({ status: false, message: "Rating must in between 1 to 5." }) }
        } else {
            return res.status(400).send({ status: false, message: "Please enter rating" })
        }

        const reviewData = await reviewModel.findByIdAndUpdate(reviewId, { $set: { ...data, reviewedAt: date } }, { new: true, upsert: true })
        existBook.reviewData = [reviewData]
        return res.status(200).send({ status: true, message: "Success", data: existBook })
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

        if (bookExist.isDeleted == true)
            return res.status(400).send({ status: false, data: "Book is deleted" })

        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "enter valid reviewId" })

        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!reviewExist) return res.status(404).send({ status: false, message: "Review not found...!" })

        if (reviewExist.isDeleted == true)
            return res.status(400).send({ status: false, data: "Review is already deleted" })

        await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } })

        await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: "Deleted succesfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}

module.exports = { createReview, updatereviewBookById, deleteBookReview }