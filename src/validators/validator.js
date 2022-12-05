const mongoose = require('mongoose');

function stringVerify(value) {
  if (typeof value !== "string" || value.trim().length == 0) {
    return false
  } return true
}

const validValue = function (value) {
  const nameRegex = /^[a-zA-Z ]+$/
  return nameRegex.test(value);
}

function validEmail(email) {
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z-]+\.[a-zA-Z-.]+$/
  return emailRegex.test(email)
}

function validPassword(password) {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
  return passwordRegex.test(password)
}

function validPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone)
}

function validPinCode(pinCode) {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.test(pinCode);
}

const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
}

function validISBN(ISBN) {
  const ISBNregex = /^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return ISBNregex.test(ISBN);
}

function validDate(date) {
  const dateRegex = /^(18|19|20)[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return dateRegex.test(date);
}

function checkName(value) {
  const name = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  return name.test(value);
}

const validTitle=function(title){
  const regexTittle=/^[a-zA-Z ]{5,}|[a-zA-z0-9]+$/;
  return regexTittle.test(title)
}


module.exports = { stringVerify, validTitle, validValue, validEmail, validPhone, validPassword, validPinCode, validISBN, isValidObjectId, validDate, checkName }

