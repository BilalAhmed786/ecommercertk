const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({

email:{
    type:'string',
    required:true
},


})



const Leads= mongoose.model('lead',Schema)

module.exports = Leads