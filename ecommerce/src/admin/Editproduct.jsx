import React, { useEffect, useRef, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { useUpdateSingleProductMutation, useDelegalleryimageMutation, useGetSingleProductQuery, useGetProductCategeroyQuery } from '../app/apiproducts';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { backendurl } from '../baseurl/baseurl';

function Editproduct() {
    const { id } = useParams();
    const { data: category } = useGetProductCategeroyQuery('');
    const [updateData] = useUpdateSingleProductMutation();
    const [galeryImgdelete] = useDelegalleryimageMutation();
    const { data, isLoading, refetch } = useGetSingleProductQuery(id);
    const [selectedImage, setSelectedImage] = useState('');
    const fileInputRef = useRef();
    const myDivRef = useRef(null);

    const [formData, setFormData] = useState({
        productname: '',
        productcat: '',
        productshortdesc: '',
        productdesc: '',
        productimage: '',
        galleryimages: [],
        inventory: '',
        saleprice: '',
        discountedprice: ''
    });

    const [existingGalleryImages, setExistingGalleryImages] = useState([]);


    useEffect(() => {
        if (data) {
            setFormData(data);
            setSelectedImage({ src: `${backendurl}/uploads/${data?.productimage}`, name: null });
            setExistingGalleryImages(data.galleryimages || []);
        }
        refetch();
    }, [data])



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage({
                src: URL.createObjectURL(file),
                file: file                      
            });
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setSelectedImage(null);
        const fileval = fileInputRef.current.value;
        setSelectedImage(fileval);
    };

    const [selectedmultipleImages, setmultipleSelectedImages] = useState([]);

    const handlemultiFileChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        setmultipleSelectedImages(prev => [...prev, ...selectedImages]);
    };

    const handlemultiDelete = async (e, index, img, id = null) => {

        e.preventDefault();
        if (id) {

            try {


                const { data } = await galeryImgdelete({ id, img })




            } catch (error) {

                console.log(error)
            }


            setExistingGalleryImages(existingGalleryImages.filter((_, i) => i !== index));

        } else {
            const updatedImages = [...selectedmultipleImages];
            updatedImages.splice(index, 1);
            setmultipleSelectedImages(updatedImages);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const productsform = async (e) => {
        e.preventDefault();
        if (myDivRef.current) {
            myDivRef.current.focus();
        }



        const form = new FormData();

        if (selectedImage?.file) {
            form.append("imagesingle", selectedImage.file);
        }

        // ✅ Append new gallery images only (not existing ones)
        selectedmultipleImages.forEach((img) => {
            if (img instanceof File) {
                form.append("imagesmultiple", img);
            }
        });
        form.append("productname", formData.productname);
        form.append("productcat", formData.productcat);
        form.append("productshortdesc", formData.productshortdesc);
        form.append("productdesc", formData.productdesc);
        form.append("inventory", formData.inventory);
        form.append("saleprice", formData.saleprice);
        form.append("discountedprice", formData.discountedprice);
        form.append("productid", formData._id);

        try {
            const result = await updateData(form);
            result.data.map((msg) => {
                msg === 'product updated' ? toast.success(msg) : toast.error(msg);
            });
        } catch (error) {
            console.error('Error submitting form data', error);
        }
    }

    if (isLoading) return <div className="loading">Loading...</div>

    return (
        <div className='dashboardcontainer'>
            <Sidebarmenu />
            <div className="marquee-container">
                <form className="edit-product-form" onSubmit={productsform}>
                    <div className="form-header">
                        <Link to="/allproducts" className="back-link">All Products</Link>
                        <h3>Edit Product</h3>
                    </div>

                    <div className="form-group">
                        <input className="input" type="text" name="productname" value={formData.productname} placeholder="Product Name" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productcat">Category</label>
                        <select id="productcat" name="productcat" value={formData.productcat} onChange={handleChange}>
                            <option value="">{formData.productcat}</option>
                            {category?.map((cat, i) => <option key={i}>{cat.productcat}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Short Description</label>
                        <textarea name="productshortdesc" value={formData.productshortdesc} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="productdesc" value={formData.productdesc} onChange={handleChange}></textarea>
                    </div>

                    <div className="image-upload-section">
                        <div className='productpreview'>
                            {selectedImage?.src && <img src={selectedImage.src} className="preview-image" />}
                        </div>
                        <div>
                            <input type="file" onChange={handleFileChange} ref={fileInputRef} hidden id="single-upload" />
                            {selectedImage?.src && <button className="btn-delete" onClick={handleDelete}>Remove</button>}
                            <button type="button" className="addbutton" onClick={() => document.getElementById('single-upload').click()}>Upload Product Image</button>
                        </div>
                    </div>

                    <div className="image-upload-section">
                        <input type="file" id="gallery-upload" hidden multiple onChange={handlemultiFileChange} />
                        <button type="button" className="addbutton" onClick={() => document.getElementById('gallery-upload').click()}>Upload Gallery Images</button>
                        <div className="gallery-preview">
                            {existingGalleryImages.map((img, i) => (
                                <div key={i} className="gallery-item">
                                    <img src={`${backendurl}/uploads/${img}`} className="gallery-img" alt="Gallery" />
                                    <button className="btn-delete" onClick={(e) => handlemultiDelete(e, i, img, formData._id)}>×</button>
                                </div>
                            ))}
                            {selectedmultipleImages.map((img, i) => (
                                <div key={`new-${i}`} className="gallery-item">
                                    <img src={URL.createObjectURL(img)} className="gallery-img" alt="Gallery" />
                                    <button className="btn-delete" onClick={(e) => handlemultiDelete(e, i)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <input className="input" type="text" name="inventory" value={formData.inventory} placeholder="Inventory" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <input className="input" type="text" name="saleprice" value={formData.saleprice} placeholder="Sale Price" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <input className="input" type="text" name="discountedprice" value={formData.discountedprice} placeholder="Discounted Price" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <button className="addbutton" type="submit">Update Product</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Editproduct;