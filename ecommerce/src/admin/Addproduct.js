import React, { useRef, useState } from 'react';
import Sidebarmenu from './component/Sidebarmenu';
import { useSubmitProductDataMutation } from '../app/apiproducts';
import { useGetProductCategeroyQuery } from '../app/apiproducts';
import { toast } from 'react-toastify';

function Addproduct() {
    const search = '';
    const formRef = useRef(null);
    const fileInputRef = useRef(null);
    const multipleFileInputRef = useRef(null);

    const [submitData] = useSubmitProductDataMutation();
    const { data } = useGetProductCategeroyQuery(search);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMultipleImages, setSelectedMultipleImages] = useState([]);
    const [formData, setFormData] = useState({
        productname: '',
        productcat: '',
        productshortdesc: '',
        productdesc: '',
        inventory: '',
        saleprice: '',
        discountedprice: ''
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage({
                    src: reader.result,
                    name: file,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setSelectedImage(null);
        fileInputRef.current.value = '';
    };

    const handleMultiFileChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        setSelectedMultipleImages([...selectedMultipleImages, ...selectedImages]);
    };

    const handleMultiDelete = (e, index) => {
        e.preventDefault();
        const updatedImages = [...selectedMultipleImages];
        updatedImages.splice(index, 1);
        setSelectedMultipleImages(updatedImages);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        selectedMultipleImages.forEach((image) => {
            form.append("multipleimages", image);
        });
        form.append("singleimage", selectedImage?.name || '');
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        try {
            const result = await submitData(form);
            if (result.data) {
                result.data.forEach((validation) => {
                    if (validation === 'Product saved successfully') {
                       
                        setFormData({
                            productname: '',
                            productcat: '',
                            productshortdesc: '',
                            productdesc: '',
                            inventory: '',
                            saleprice: '',
                            discountedprice: ''
                        });
                        setSelectedImage(null);
                        setSelectedMultipleImages([]);
                        fileInputRef.current.value = '';
                        multipleFileInputRef.current.value = '';
                        formRef.current.reset();


                        toast.success(validation);

                    } else {

                        console.log('eror display')
                        toast.error(validation);
                    }
                });
            }
        } catch (error) {
            console.error('Error submitting form data', error);
        }
    };

    return (
        <div className='dashboardcontainer'>
            <Sidebarmenu />
            <div className="marquee-container">
                <form ref={formRef} onSubmit={handleSubmit}>
                    <h3 className="page-title">Add product</h3>
                    <div className="form-group">
                        <input
                            className="prdouctaddinput"
                            type="text"
                            name="productname"
                            placeholder="Product Name"
                            onChange={handleChange}
                            value={formData.productname}
                        />
                    </div>
                    <div className="form-group">
                        <label className="productaddlab" htmlFor="productcat">Product Categories</label>
                        <select
                            id="productcat"
                            name="productcat"
                            onChange={handleChange}
                            value={formData.productcat}
                        >
                            <option>Select Category</option>
                            {data && data.map((category, index) => (
                                <option key={index} value={category.productcat}>{category.productcat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="productaddlab" htmlFor="shortdesc">Short Description</label>
                        <textarea
                            name="productshortdesc"
                            cols="50"
                            rows="10"
                            onChange={handleChange}
                            value={formData.productshortdesc}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="productaddlab" htmlFor="longdesc">Description</label>
                        <textarea
                            name="productdesc"
                            cols="50"
                            rows="10"
                            onChange={handleChange}
                            value={formData.productdesc}
                        ></textarea>
                    </div>
                    <div>
                        <div>
                            <input
                                type="file"
                                name="singleimage"
                                id="imgInp"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {selectedImage && (
                                <div className='proimage'>
                                    <img style={{ width: 100, margin:'auto' }} src={selectedImage.src} alt='' />
                                    <button id='previewimage' style={{ display: 'block', margin: 'auto' }} onClick={handleDelete}>X</button>
                                </div>
                            )}
                        </div>
                        <input
                            onClick={() => document.getElementById('imgInp').click()}
                            style={{ display: 'block', margin: 'auto' }}
                            type="button"
                            id="loadFileXml"
                            className="addbutton"
                            value="Product Image"
                        />
                    </div>
                    <input
                        style={{ display: 'none' }}
                        id="image"
                        type="file"
                        name="multipleimages"
                        onChange={handleMultiFileChange}
                        multiple
                        ref={multipleFileInputRef}
                    />
                    <input
                        style={{ display: 'block', margin: 'auto', marginTop: 35 }}
                        type="button"
                        id="loadFileimage"
                        className="addbutton"
                        value="Gallery Images"
                        onClick={() => document.getElementById('image').click()}
                    />
                    <div id="gallerypreview">
                        {selectedMultipleImages && selectedMultipleImages.map((image, index) => (
                            <div key={index}>
                                <img className='galleryimgs' src={URL.createObjectURL(image)} style={{ display: 'block', width: '100px' }} alt='' />
                                <button className='btn-imagegallery' onClick={(e) => handleMultiDelete(e, index)}>x</button>
                            </div>
                        ))}
                    </div>
                    <div className="form-group">
                        <input
                            className="prdouctaddinput"
                            type="text"
                            name="inventory"
                            placeholder="Inventory"
                            onChange={handleChange}
                            value={formData.inventory}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="prdouctaddinput"
                            type="text"
                            name="saleprice"
                            placeholder="Sale Price"
                            onChange={handleChange}
                            value={formData.saleprice}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="prdouctaddinput"
                            type="text"
                            name="discountedprice"
                            placeholder="Discounted Price"
                            onChange={handleChange}
                            value={formData.discountedprice}
                        />
                    </div>
                    <div className="form-group">
                        <button className="addbutton" type="submit" name="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Addproduct;
