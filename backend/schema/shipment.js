const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({
shipment:{
    type:'string',
    required:true
}

})



const shipment= mongoose.model('shipment',Schema)

module.exports = shipment