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
mobile:{
    type:'string',
    required:true
},
city:{
    type:'string',
    required:true
},
address:{
    type:'string',
    required:true
},

})



const Billingaddress= mongoose.model('billingaddress',Schema)

module.exports = Billingaddress