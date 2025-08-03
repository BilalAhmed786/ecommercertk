const moongose = require('mongoose')
const db = process.env.DB

moongose.connect(db)
.then(()=>{
    console.log("connected to database")
})
.catch(()=>{
    console.log('not connected')
})