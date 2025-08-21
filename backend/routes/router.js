const express=require('express')
const {register,login,logout,auth,changepass,clientchangepass,Forgetpass,resetpassword} = require('../controller/authcontroller')
const verification = require('../middleware/authorization')
const userrole  = require('../middleware/userrole')
const upload = require('../multer/multer');
const {addproducts,getproducts,getsingleproduct,addcategory,getcategory,getsinglecategory,updateprocategory,deleteprocategory,getcurrency,updatecurrency,getshipment,updateshipment,
allproducts,removeprod,removemultipleprod,updateprod,productsreviews,getproductsreviews,getsingleadminreview,getproductsslide,getreviewsforadmin,
deletemultiplereviews,deletesinglereview,updatereviewstatus,deletegalleryimage} = require('../controller/products');

const {alluser,singleuser,deleteuser,deletemultipleUser,updatesingleuser,searchuser,newsletter} = require('../controller/users');
const{paymentmode,getorders,getsingleorder,removesingleorder,removemultipleorders,orderstatus}= require('../controller/orderadmin')
const{getBillingaddress,updateBillingaddress,getclientorders,removeclientorders,removemultipleclientorder,getsingleclientorder}  =  require('../controller/clientorder');
const {getfilterrange,addfilterrange,editfilterrange,deletefilterrange} = require('../controller/productfilter')



const router = express.Router()

router.get('/',(req,res)=>{
    res.json('hello world')
})
router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/forgetpass',Forgetpass)
router.post('/resetpassword',resetpassword)
router.post('/changepass',changepass)
router.post('/clientchangepass',clientchangepass)
router.post('/auth',verification,auth)
router.post('/products',upload.fields([{ name: 'singleimage' }, { name: 'multipleimages' }]),addproducts)
router.get('/products',getproducts)
router.get('/product/:id',getsingleproduct)

//admin access only
router.post('/productcategory',verification,userrole('admin'),addcategory)
router.get('/productcategory',getcategory)
router.get('/productcategory/:id',verification,userrole('admin'),getsinglecategory)
router.post('/updateprocategory',verification,userrole('admin'),updateprocategory)
router.delete('/deleteprocategory/:id',verification,userrole('admin'),deleteprocategory)
router.get('/currency',getcurrency)
router.post('/updatecurrency',verification,userrole('admin'),updatecurrency)
router.get('/shipment',getshipment)
router.post('/updateshipment',verification,userrole('admin'),updateshipment)
router.get('/allproducts',verification,userrole('admin'),allproducts)
router.get('/getadminreviews',verification,userrole('admin'),getreviewsforadmin)
router.get('/getsingleadminreview/:id',verification,userrole('admin'),getsingleadminreview)
router.delete('/deletesinglereview/:id',verification,userrole('admin'),deletesinglereview)
router.post('/deletemultiplereview',verification,userrole('admin'),deletemultiplereviews)
router.post('/updatereviewstatus',verification,userrole('admin'),updatereviewstatus)
router.delete('/removeprod/:id',verification,userrole('admin'),removeprod)
router.delete('/removemultipleprod',verification,userrole('admin'),removemultipleprod)
router.post('/updateprod',upload.fields([{ name: 'imagesingle' }, { name: 'imagesmultiple' }]),updateprod)
router.post('/deletegalleryimg',verification,userrole('admin'),deletegalleryimage)
router.get('/getranges',getfilterrange)
router.post('/addranges',verification,userrole('admin'),addfilterrange)
router.post('/editranges',verification,userrole('admin'),editfilterrange)
router.delete('/deleteranges/:id',verification,userrole('admin'),deletefilterrange)

//admin access only
//all register users for admin info
router.get('/alluser',verification,userrole('admin'),alluser)
router.get('/singleuser/:id',verification,userrole('admin'),singleuser)
router.post('/updateuser',verification,userrole('admin'),updatesingleuser)
router.delete('/deleteuser/:id',verification,userrole('admin'),deleteuser)
router.post('/deletemultipleuser',verification,userrole('admin'),deletemultipleUser)
router.get('/searchuser',verification,userrole('admin'),searchuser)
router.post('/newsletter',newsletter)

router.post('/productsreviews',productsreviews)
router.get('/getproductreviews/:id',getproductsreviews)
router.get('/getproductslide',getproductsslide)

//order record
router.post('/paymentmode',paymentmode)
router.get('/orders',verification,userrole('admin'),getorders)
router.get('/order/:id',verification,userrole('admin'),getsingleorder)
router.delete('/removeorder/:id',verification,userrole('admin'),removesingleorder)
router.post('/removemultipleadminorder',verification,userrole('admin'),removemultipleorders)
router.post('/orderstatus',verification,userrole('admin'),orderstatus)
//client route
router.get('/billingaddress/:email',verification,userrole('subscriber'),getBillingaddress)
router.post('/updatebillingaddress',verification,userrole('subscriber'),updateBillingaddress)
router.get('/clientorders',verification,userrole('subscriber'),getclientorders)
router.get('/clientorders/:id',verification,userrole('subscriber'),getsingleclientorder)
router.delete('/removeclientorder/:id',verification,userrole('subscriber'),removeclientorders)
router.post('/removemultipleclientorder',verification,userrole('subscriber'),removemultipleclientorder)





module.exports = router