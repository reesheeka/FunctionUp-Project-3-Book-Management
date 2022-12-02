const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const { isValidObjectId } = require('mongoose');
const moment = require('moment');

//---------------------------CREATE REVIEW---------------------------

const createReview = async function(req,res){
    
    const bookId = req.params.bookId
    // if(!bookId){
    //     return res.status(400).send({ status: false, message: "BookId is required in params" })
    // }
    if(bookId){
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter valid bookId." })
        }
    }
    const checkBook = await bookModel.findOne({_id: bookId, isDeleted: false})
    if(!checkBook){
        return res.status(400).send({status: false, message: "Book not found or already deleted."})
    }

    const data = req.body
    if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: "Please enter book details." })
    }

    const { rating, reviewedAt, reviewedBy } = data

    if(!reviewedBy){
        return res.status(400).send({ status: false, message: "ReviewedBy is required." })
    }
    if(!reviewedAt){
        return res.status(400).send({ status: false, message: "ReviewedAt is required." })
    }
    if(!rating){
        return res.status(400).send({ status: false, message: "Rating is required." })
    }
    // const date = moment.format()
    // data.reviewedAt = date

    //data.bookId = bookId

    const reviewData = await reviewModel.create(data, {bookId: bookId} )

    return res.status(201).send({status: true, message: "Success", data: reviewData})
}




module.exports = { createReview }