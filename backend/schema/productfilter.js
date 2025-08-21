const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({
 range:{
    type:'string',
    required:true,
    
}

})



const productfilter = mongoose.model('productfilter',Schema)

module.exports = productfilter