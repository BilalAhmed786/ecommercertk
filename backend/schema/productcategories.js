const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({
productcat:{
    type:'string',
    required:true,
    unique: true,
}

})



const productcat= mongoose.model('productcategory',Schema)

module.exports = productcat