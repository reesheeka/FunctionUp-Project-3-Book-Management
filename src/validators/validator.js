const mongoose = require('mongoose');

function stringVerify(value) {
  if (typeof value !== "string" || value.trim().length == 0) {
      return false
  }
  return true
}

const isValidTitle = (title) => {
    let correctTitle = /^Mr|Mrs|Miss+$/;
    return correctTitle.test(title);
  };

  const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name);
  };

  const isValidEmail = function (email) {
    const emailRegex =
    /^[a-zA-Z0-9_.+-]+@[a-z]+.[a-z]+$/;
    return emailRegex.test(email);
  };
  
  // Password Validation
  const isValidPassword = function (password) {
    const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
    return passwordRegex.test(password);
  };
  
  //Phone Validation
  const isValidPhone = function (phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  
   // city Validation
   const isValidCity = function (city) {
    const cityRegex = /^[a-zA-Z ]+$/;
    return cityRegex.test(city);
  };

  // pinCode Validation
  const isValidPinCode = function (pinCode) {
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    return pinCodeRegex.test(pinCode);
  };
  
  // ObjectId  
  const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
  };
  
  // ISBN validation   
  const isValidISBN = (ISBN) => {
      const ISBNregex =/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/; 
      return ISBNregex.test(ISBN);
  }
  
  // excerpt Validation  
  const isValidExcerpt = (excerpt) => {
      const excerptRegex = /^[a-zA-Z ]+$/;
      return excerptRegex.test(excerpt);
  }
  
  const isValidDate = (date) => {
    const dateRegex =  /^(18|19|20)[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    return dateRegex.test(date);
  }

  const isValidCategory = (category) => {
    const categoryRegex =  (/^[a-zA-Z ]+$/);
    return categoryRegex.test(category);
  }
  
  const isValidSubCategory = (subcategory) => {
    const subcategoryRegex =  (/^[a-zA-Z ]+$/);
    return subcategoryRegex.test(subcategory);
  }
  
  module.exports = {isValidName,isValidEmail,isValidPhone,isValidPassword,isValidCity,isValidPinCode,isValidTitle,isValidISBN,isValidObjectId,isValidExcerpt,isValidDate,isValidCategory};
  
