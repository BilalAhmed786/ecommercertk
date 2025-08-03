const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    productname: {
        type: 'string',
        required: true
    },
    productcat: {
        type: 'string',
        required: true
    },
    productdesc: {
        type: 'string',
        required: true
    },
    productshortdesc: {
        type: 'string',
        required: true
    },
    productimage: {
        type: 'string',
        required: true
    },
    galleryimages: {


        type: ['string'],
        required: true
    },
    inventory: {
        type: 'number',
        required: true
    },
    saleprice: {
        type: 'number',
        required: true
    },
    discountedprice: {
        type: 'number',
        required: true
    },
})



const products = mongoose.model('product', Schema)

module.exports = products