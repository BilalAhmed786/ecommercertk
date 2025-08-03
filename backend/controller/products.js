const fs = require('fs');
require('dotenv').config();
const path = require('path');
const Products = require('../schema/products')
const Productcat = require('../schema/productcategories')
const Currency = require('../schema/currency')
const Shipment = require('../schema/shipment');
const Productreview = require('../schema/productreviews');
const { Console } = require('console');






const addproducts = async (req, res) => {
  try {
    const errors = [];
    const { productname, productcat, productshortdesc, productdesc, inventory, saleprice, discountedprice } = req.body;

    const singleimage = req.files['singleimage'] ? req.files['singleimage'][0].filename : undefined;
    const productimages = req.files['multipleimages'] ? req.files['multipleimages'].map(image => image.filename) : undefined;

    if (!singleimage || !productimages) {
      errors.push('Invalid gallery or product image format');
    }

    if (!productname || !productcat || !productdesc || !productshortdesc || !inventory || !saleprice) {
      errors.push('All fields are required');
    }

    const productexist = await Products.findOne({ productname });
    if (productexist) {
      errors.push('Product already added');
    }

    if (errors.length > 0) {
      return res.json(errors);
    }

    const newProduct = new Products({
      productname,
      productcat,
      productdesc,
      productshortdesc,
      productimage: singleimage,
      galleryimages: productimages,
      inventory,
      saleprice,
      discountedprice
    });

    const prodsave = await newProduct.save();

    if (prodsave) {
      return res.json(['Product saved successfully']);
    } else {
      console.log('Product not saved');
      return res.status(500).json(['Product not saved']);
    }
  } catch (err) {
    console.error('Error saving product:', err);
    return res.status(500).json(['Sale price, inventory, and discounted price should be numbers']);
  }
};



const getproducts = async (req, res) => {



  const { page = 1, saleprice, productcat, productname, pageSize } = req.query;

  const skip = (page - 1) * pageSize;

  const filters = {};

  filters.inventory = { $gt: 0 }  //if zero inventory doesnot show on shop page

  if (saleprice) {

    const [minPrice, maxPrice] = saleprice.split('-').map(parseFloat);


    filters.saleprice = { $gte: minPrice, $lte: maxPrice };
  }
  if (productcat) {
    filters.productcat = productcat;
  }

  if (productname) {

    filters.productname = { $regex: new RegExp(productname, 'i') }
  }


  const products = await Products.find(filters).skip(skip).limit(pageSize);




  res.json(products);


}


const getsingleproduct = async (req, res) => {

  try {

    const product = await Products.findById(req.params.id);

    if (product) {

      res.json(product)
    }

  }
  catch (error) {

    if (error) {

      console.log(error)
    }
  }

}

const addcategory = async (req, res) => {
  try {
    const { productcat } = req.body

    if (!productcat) {

      return res.json('field is required')
    }

    const category = new Productcat({ productcat })

    const categorysave = await category.save()

    if (categorysave) {

      res.json('category saved')

    } else {

      console.log('something wrong')
    }
  } catch (error) {

    if (error.code === 11000) {

      res.json('Already add !!')

    }

  }

}



const getcategory = async (req, res) => {

  const { searchTerm } = req.query
  try {
    const query = { productcat: { $regex: new RegExp(searchTerm, 'i') } }

    const categories = await Productcat.find(query)

    if (categories) {

      return res.json(categories)
    } else {

      console.log('not wordking cat api')
    }

  } catch (error) {

    console.log(error)
  }




}

const getsinglecategory = async (req, res) => {

  try {
    const singlecat = await Productcat.find({ _id: req.params.id })

    return res.json(singlecat)

  } catch (error) {
    console.log(error)
  }


}

const updateprocategory = async (req, res) => {

  const { _id, productcat } = req.body

  try {

    if (!productcat) {

      return res.json("field required")

    }
    const updatecat = await Productcat.updateOne({ _id }, { $set: { productcat } })

    if (updatecat) {

      res.json('update successfully')
    } else {

      console.log('error update')

    }

  } catch (error) {

    console.log(error)
  }




}

const deleteprocategory = async (req, res) => {


  try {

    const catdelete = await Productcat.findByIdAndDelete(req.params.id)

    if (catdelete) {

      res.json('category deleted')
    } else {

      console.log('not deleted category')

    }

  } catch (error) {

    console.log(error)
  }

}
const getcurrency = async (req, res) => {

  const currency = await Currency.find({})

  return res.json(currency)


}


const updatecurrency = async (req, res) => {

  const { _id, currency } = req.body

  try {

    if (!currency) {

      return res.json('field required')

    }

    if (!_id) {

      var findcurrency = await Currency.find({ currency })

    } else {

      var findcurrency = await Currency.find({ _id })

    }

    if (findcurrency.length == 0) {

      const savecurr = new Currency({ currency })

      const saved = await savecurr.save()

      if (saved) {

        return res.json('save successfully')
      } else {

        console.log('not saved')

      }
    }

    if (findcurrency) {

      const updatevalue = await Currency.updateOne({ _id: findcurrency[0]._id }, { $set: { currency } })

      if (updatevalue) {

        res.json('save successfully')
      }
    }
  }
  catch (error) {

    console.log(error)

  }


}

const getshipment = async (req, res) => {

  const currency = await Shipment.find({})

  return res.json(currency)


}

const updateshipment = async (req, res) => {

  const { _id, shipment } = req.body

  try {

    if (!shipment) {

      return res.json('field required')

    }

    if (!_id) {

      var findcurrency = await Shipment.find({ shipment })

    } else {

      var findcurrency = await Shipment.find({ _id })

    }

    if (findcurrency.length == 0) {

      const savecurr = new Shipment({ shipment })

      const saved = await savecurr.save()

      if (saved) {

        return res.json('charges saved')
      } else {

        console.log('save successfully')

      }
    }

    if (findcurrency) {

      const updatevalue = await Shipment.updateOne({ _id: findcurrency[0]._id }, { $set: { shipment } })

      if (updatevalue) {

        res.json('save successfully')
      }
    }
  }
  catch (error) {

    console.log(error)

  }


}

//admin working with products
const allproducts = async (req, res) => {

  const { search = '' } = req.query

  try {


    const query = {
      $or: [
        { productname: { $regex: new RegExp(search, 'i') } },
        { productcat: { $regex: new RegExp(search, 'i') } },

      ]
    }




    const products = await Products.find(query)


    res.json(products)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }




}


const removeprod = async (req, res) => {

  try {
    const deletedpro = await Products.findByIdAndDelete(req.params.id);


    res.json('Product deleted successfully');

    if (!deletedpro) {

      return res.status(404).json({ error: 'User not found' });
    }


    const absoluteFilePath = path.join(__dirname, `../public/uploads/${deletedpro.productimage}`)



    fs.unlink(absoluteFilePath, (err) => {

      if (err) {
        console.error('Error deleting file:', err);

      } else {

        console.log('File deleted successfully');
      }
    });



    const images = deletedpro.galleryimages.map((images) => {



      fs.unlink(path.join(__dirname, `../public/uploads/${images}`), (error) => {

        if (error) {

          console.log(error)

        } else {

          console.log('gallery images deleted')
        }
      })

    })

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: 'Internal server error' });
  }



}


//multiple products remove
const removemultipleprod = async (req, res) => {

  console.log(req.body)

  if (req.body.length == 0) {


    return res.json('no item selected')


  }


  const allproducts = await Products.find({ _id: { $in: req.body } })


  Products.deleteMany({ _id: { $in: req.body } })

    .then(result => {

      console.log(result)

      res.json('products deleted successfully')


    })
    .catch(error => {
      console.error('Error deleting documents:', error);
    });


  allproducts.map((images, index) => {

    fs.unlink(path.join(__dirname, `../public/uploads/${images.productimage}`), (error) => {

      if (error) {

        console.log(error)
      } else {

        console.log('images deleted')
      }

    })

    images.galleryimages.map((gallery) => {

      fs.unlink(path.join(__dirname, `../public/uploads/${gallery}`), (error) => {

        if (error) {

          console.log(error)
        } else {

          console.log('gallery images deleted')
        }

      })


    })


  })


}


const updateprod = async (req, res) => {
  try {
    const error = [];

    const {
      productname,
      productcat,
      productshortdesc,
      productdesc,
      inventory,
      saleprice,
      discountedprice,
      productid
    } = req.body;

    const image = req.files['imagesingle'];
    const imagespro = req.files['imagesmultiple'];

    const productimage = image ? image[0].filename : null;
    const galleryimages = imagespro ? imagespro.map((img) => img.filename) : [];


    if (!productname || !productcat || !productdesc || !productshortdesc || !inventory || !saleprice || !discountedprice) {
      error.push('All fields are required');
      return res.json(error);
    }

    
    const updateFields = {
      productname,
      productcat,
      productdesc,
      productshortdesc,
      inventory,
      saleprice,
      discountedprice
    };

    
    if (productimage) {
      const product = await Products.findById(productid);
      if (product?.productimage) {
        const oldImagePath = path.join(__dirname, `../public/uploads/${product.productimage}`);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old product image:', err);
          else console.log('Old product image deleted');
        });
      }
      updateFields.productimage = productimage;
    }

   
    if (galleryimages.length > 0) {
      const product = await Products.findById(productid);
      if (product?.galleryimages?.length > 0) {
        product.galleryimages.forEach((img) => {
          const oldGalleryPath = path.join(__dirname, `../public/uploads/${img}`);
          fs.unlink(oldGalleryPath, (err) => {
            if (err) console.error('Error deleting gallery image:', err);
            else console.log('Gallery image deleted');
          });
        });
      }
      updateFields.galleryimages = galleryimages;
    }

    const productupdate = await Products.updateOne(
      { _id: productid },
      { $set: updateFields }
    );

    if (productupdate.modifiedCount > 0) {
      return res.json(['product updated']);
    } else {
      return res.json(['No changes were made']);
    }
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};




const productsreviews = async (req, res) => {

  try {
    const { id, rating, formdata: { name, email, comment } } = req.body

    console.log(req.body)

    if (!name || !email || !comment || !rating) {


      return res.json('All fields required')

    }

    const user = await Productreview.find({ email: email })


    if (user.length === 0) {


      const saveuser = new Productreview({ productid: id, rating, name, email, comment })


      const newuser = await saveuser.save()


      if (newuser) {

        console.log('comment saved')
        res.json('comment ready for publish')

      } else {
        console.log('somthing wrong happend')
      }

    } else {

      const updatecomment = await Productreview.updateOne({ _id: user[0]._id }, { $set: { productid: id, rating, name, email, comment } })


      if (updatecomment) {


        console.log("comment updated")
        res.json('comment ready for publish')
      } else {

        console.log("comment update fail")
      }
    }
  } catch (error) {

    console.log(error)
  }

}


const getproductsreviews = async (req, res) => {


  try {


    const result = await Productreview.find({ productid: req.params.id, status: 'approved' })


    if (result) {

      res.json(result)
    }


  } catch (error) {

    console.log(error)
  }

}


const getsingleadminreview = async (req, res) => {
  try {
    const singlereview = await Productreview.find({ _id: req.params.id })

    if (singlereview) {

      res.json(singlereview)

    } else {

      console.log('something wrong happend')

    }


  }
  catch (error) {

    console.log(error)
  }


}

const getproductsslide = async (req, res) => {

  try {


    const result = await Products.find().sort({ createdAt: -1 }).limit(4);

    res.json(result)

  } catch (error) {

    console.log(error)
  }

}

const getreviewsforadmin = async (req, res) => {

  const { searchTerm } = req.query;

  try {
    const query = {
      $or: [
        { name: { $regex: new RegExp(searchTerm, 'i') } },
        { email: { $regex: new RegExp(searchTerm, 'i') } },
        { comment: { $regex: new RegExp(searchTerm, 'i') } },
        { rating: { $regex: new RegExp(searchTerm, 'i') } },
        { status: { $regex: new RegExp(searchTerm, 'i') } },


      ]
    };

    const totalCount = await Productreview.countDocuments(query);



    const Reviews = await Productreview.find(query);

    res.json({
      Reviews,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }




}

const deletesinglereview = async (req, res) => {

  const userdeleted = await Productreview.findByIdAndDelete(req.params.id)

  if (userdeleted) {


    return res.json('review deleted successfully')
  }

}

const deletemultiplereviews = async (req, res) => {

  if (req.body.length === 0) {

    return res.json('item not selected')
  }

  const multiplereview = await Productreview.deleteMany({ _id: { $in: req.body } })

  if (multiplereview) {

    res.json('reviews deleted successfully')
  }

}

const updatereviewstatus = async (req, res) => {


  try {
    const { updatecommentstatus, selectedRows } = req.body

    if (!updatecommentstatus || selectedRows.length === 0) {

      return res.json('item not selected')

    }

    const updatereviews = await Productreview.updateMany({ _id: { $in: selectedRows } }, { $set: { status: updatecommentstatus } })

    if (updatereviews) {

      res.json('select item review status updated')
    } else {

      console.log('something wrong')
    }


  } catch (error) {
    console.log(error)
  }


}


const deletegalleryimage = async (req, res) => {
  const { id, img } = req.body;

  try {
    const foundProduct = await Products.findById(id);

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the image from galleryimages array
    foundProduct.galleryimages.pull(img);

    // Save the updated product
    await foundProduct.save();

    // Return a response to the client
    return res.status(200).json({ message: "Image deleted", product: foundProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  addproducts, getproducts,
  getsingleproduct, addcategory,
  getcategory, getsinglecategory, updateprocategory, deleteprocategory, getcurrency,
  updatecurrency, getshipment, updateshipment,
  allproducts, removeprod, removemultipleprod, updateprod, productsreviews,
  getproductsreviews, getsingleadminreview, getproductsslide, getreviewsforadmin, deletesinglereview,
  deletemultiplereviews, updatereviewstatus, deletegalleryimage

}