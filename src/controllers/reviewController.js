const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const { stringVerify, validTitle, isValidObjectId, checkName } = require("../validators/validator");
const moment = require("moment")


//--------------------------------CREATE REVIEW---------------------------------
const createReview = async function (req, res) {

    try {
        const bookId = req.params.bookId
        if (bookId) {
            if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter a valid bookId." }); }
        }
        const checkBookId = await bookModel.findById(bookId)
        if (!checkBookId) { return res.status(400).send({ status: false, message: "Book not found." }) }

        const data = req.body

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter book review details." }); }

        const { rating, reviewedBy, review } = data

        if (!rating && rating != 0) { return res.status(400).send({ status: false, message: "Rating is required." }); }
        if (rating < 1 || rating > 5 || typeof (rating) != "number") { return res.status(400).send({ status: false, message: "Rating must in between 1 to 5 and Numeric format" }); }

        if (!review) { return res.status(400).send({ status: false, message: "Review is required." }); }
        if (!stringVerify(review)) { return res.status(400).send({ status: false, message: "Review should be of type String." }); }

        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBook) { return res.status(400).send({ status: false, message: "Book not found." }); }
        if (checkBook.isDeleted == true) { return res.status(400).send({ status: false, message: "Book is already deleted." }); }

        if (reviewedBy) {
            if (!checkName(reviewedBy)) { return res.status(400).send({ status: false, message: "ReviewedBy is invalid." }); }
        }
        if (!reviewedBy) { data.reviewedBy = "Guest" }

        data.bookId = bookId
        data.reviewedAt = moment().format("YYYY-MM-DD")

        const reviewsData = await reviewModel.create(data)

        let updatebookdata = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true }).lean()
        updatebookdata.reviewsData = [reviewsData]

        return res.status(201).send({ status: true, message: "Success", data: updatebookdata })
    }
    catch (error) {
        return res.status(500).send({ staus: false, message: error.message });
    }
}


//------------------------------UPDATE REVIEW----------------------------

const updatereviewBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (bookId) {
            if (!isValidObjectId(bookId)) { return res.status(404).send({ status: false, message: "Please enter a valid book id." }) }
        }
        const checkBookId = await bookModel.findById({ _id: bookId, isDeleted: false }).lean()
        if (!checkBookId) { return res.status(400).send({ status: false, message: "Book not found." }) }

        const reviewId = req.params.reviewId
        if (reviewId) {
            if (!isValidObjectId(reviewId)) { return res.status(404).send({ status: false, message: "Please enter a valid review id." }) }
        }
        const checkreviewId = await reviewModel.findOne({ _id: reviewId, bookId:bookId, isDeleted: false })
        if (!checkreviewId) { return res.status(400).send({ status: false, message: "Review not found." }) }

        const data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter details for updation." }); }

        let { review, reviewedBy, rating } = data

        if (review) {
            if (!stringVerify(review)) { return res.status(400).send({ status: false, message: "Review should be of type String." }); }
        }

        if (reviewedBy) {
            if (!checkName(reviewedBy)) { return res.status(400).send({ status: false, message: "ReviewedBy is invalid." }); }
        }
        
        if (rating) {
            if (rating < 1 || rating > 5 || typeof (rating) != "number") { return res.status(400).send({ status: false, message: "Rating must in between 1 to 5 and Numeric format." }) }
        }
        
        if (!validTitle(reviewedBy)) return res.status(400).send({ status: false, message: "Can not have empty request for ReviewwdBy" })
        if (!validTitle(rating)) return res.status(400).send({ status: false, message: "Can not have empty request for Rating" })
        if (!validTitle(review)) return res.status(400).send({ status: false, message: "Can not have empty request for Review" })
        const reviewData = await reviewModel.findByIdAndUpdate(reviewId, { $set: { review: data.review, rating: data.rating, reviewedBy :data.reviewedBy, reviewedAt: new Date() } }, { new: true, upsert: true })

        checkBookId.reviewData = [reviewData]

        return res.status(200).send({ status: true, message: "Success", data: checkBookId })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//------------------------------DELETE REVIEW------------------------------

const deleteBookReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let reviewId = req.params.reviewId

        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Please enter valid bookId" })

        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "enter valid reviewId" })

        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!bookExist) return res.status(404).send({ status: false, message: "Book not found" });

        if (bookExist.isDeleted == true)
            return res.status(400).send({ status: false, data: "Book is deleted" })


        const reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId })

        if (!reviewExist) return res.status(404).send({ status: false, message: "Review not found...!" });

        if (reviewExist.isDeleted == true)
            return res.status(400).send({ status: false, data: "Review is already deleted." });

        await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } })

        await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: "Review deleted succesfully." });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }

}

module.exports = { createReview, updatereviewBookById, deleteBookReview }