const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({

productid:{
    type: mongoose.Schema.Types.ObjectId,
    required: true

},
rating:{
    type:'string',
    required:true
  
  },
name:{
    type:'string',
    required:true
},
email:{
    type:'string',
    required:true
},
comment:{
    type:'string',
    required:true
},
status:{
    type:'string',
    default:'pending',
    
},
})



const productreview= mongoose.model('productsreview',Schema)

module.exports = productreview