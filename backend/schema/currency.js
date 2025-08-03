const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({
currency:{
    type:'string',
    required:true,
    
}

})



const currency= mongoose.model('currency',Schema)

module.exports = currency