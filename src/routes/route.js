const express = require('express');
const router = express.Router();                
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const reviewController = require('../controllers/reviewController');
const MW = require('../middlewares/middleware');
const aws= require("aws-sdk");

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

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    
    let s3= new aws.S3({apiVersion: '2006-03-01'}); 

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket", 
        Key: "abc/" + file.originalname, 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        // console.log(data)
        // console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    

   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        
        if(files && files.length>0){
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})




router.all('/*', function (req, res) {
    res.status(400).send({ status: false, message: 'Invalid HTTP Request' });
})


module.exports = router;