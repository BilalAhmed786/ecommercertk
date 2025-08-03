const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({
name:{
    type:'string',
    required:true
},
email:{
    type:'string',
    required:true
},
password:{
    type:'string',
    required:true
},
retypepassword:{
    type:'string',
    required:true
},
role:{
    type:'string',
    default:'subscriber'
}

})



const user= mongoose.model('user',Schema)

module.exports = user