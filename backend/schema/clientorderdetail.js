const mongoose =  require('mongoose')

const Schema= new mongoose.Schema({

orderno:{
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
productname:{
    type:['string'],
    required:true
},
productsprice:{
    type:['string'],
    required:true
},
productquantity:{
    type:['string'],
    required:true
},
carttotal:{
    type:'string',
    required:true
},
shipmentcharges:{
    type:'string',
    required:true
},
totalamount:{
    type:'string',
    required:true
},
stripepayment:{
    type:'string',
    required:true
},
status:{
    type:'string',
    default:'pending'
},
timestamp: { 
    type:'string',
    default:function() {
        // Get current date and time
        const currentDate = new Date();
        // Format date as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        // Format time as HH:MM AM/PM
        let hours = currentDate.getHours();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        // Construct the date and time string
        return `${year}-${month}-${day} ${hours}:${minutes} ${amOrPm}`;
    }

},
})



const clientorder= mongoose.model('clientorderdet',Schema)

module.exports = clientorder