const Productfilter = require('../schema/productfilter')
const getfilterrange = async (req, res) => {

    try {

        const data = await Productfilter.find({})

        return res.json(data)
    } catch (error) {

        console.log(error)
    }


}


const addfilterrange = async (req, res) => {

    const { range } = req.body

    if (!range) {

        return res.status(400).json("filed is required")
    }

  try {

        const findrange = await Productfilter.findOne({ range: range })


        if (findrange) {

            return res.status(400).json('Range already exist')
        }


        const record = new Productfilter({ range })


        const recordsave = await record.save()

        if (recordsave) {

            return res.json('range created')
        }


    } catch (error) {

        console.log(error)
    }



}

const editfilterrange = async (req, res) => {

    const { id, range } = req.body


    if (!range) {

        return res.status(401).json("field is required")
    }

    try {

        const updaterange = await Productfilter.findByIdAndUpdate(id, {range},{new:true})

        if (updaterange) {


            return res.json("updated")
        }


    } catch (error) {

        console.log(error)
    }



}


const deletefilterrange = async (req, res) => {

    const { id } = req.params

     try {

        const deleterange = await Productfilter.findOneAndDelete(id)

        if (deleterange) {


            return res.json('delete successfully')
        }

    } catch (error) {

        console.log(error)
    }


}


module.exports = { getfilterrange, addfilterrange, editfilterrange, deletefilterrange }