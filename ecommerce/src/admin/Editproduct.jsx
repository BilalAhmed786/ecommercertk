import React, { useEffect, useRef, useState } from "react";
import Sidebarmenu from "./component/Sidebarmenu";
import {
  useUpdateSingleProductMutation,
  useDelegalleryimageMutation,
  useGetSingleProductQuery,
  useGetProductCategeroyQuery,
} from "../app/apiproducts";

import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { backendurl } from "../baseurl/baseurl";

import {
  ArrowLeft,
  Package,
  Tag,
  FileText,
  ImagePlus,
  Upload,
  Trash2,
  X,
  Boxes,
  DollarSign,
  Save,
  Images,
  Layers3,
} from "lucide-react";

function Editproduct() {
  const { id } = useParams();

  const { data: category } = useGetProductCategeroyQuery("");
  const [updateData] = useUpdateSingleProductMutation();
  const [galeryImgdelete] = useDelegalleryimageMutation();

  const { data, isLoading } = useGetSingleProductQuery(id);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedmultipleImages, setmultipleSelectedImages] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);

  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const myDivRef = useRef(null);

  const [formData, setFormData] = useState({
    productname: "",
    productcat: "",
    productshortdesc: "",
    productdesc: "",
    productimage: "",
    galleryimages: [],
    inventory: "",
    saleprice: "",
    discountedprice: "",
  });

  useEffect(() => {
    if (data) {
      setFormData(data);

      setSelectedImage({
        src: `${backendurl}/uploads/${data?.productimage}`,
        file: null,
      });

      setExistingGalleryImages(data.galleryimages || []);
    }
  }, [data]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedImage({
      src: URL.createObjectURL(file),
      file,
    });
  };

  const handleDeleteMainImage = (e) => {
    e.preventDefault();

    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlemultiFileChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    setmultipleSelectedImages((prev) => [
      ...prev,
      ...selectedImages,
    ]);

    e.target.value = "";
  };

  const handlemultiDelete = async (e, index, img, imageId = null) => {
    e.preventDefault();

    if (imageId) {
      try {
        await galeryImgdelete({
          id: imageId,
          img,
        });

        setExistingGalleryImages((prev) =>
          prev.filter((_, i) => i !== index)
        );

        toast.success("Gallery image removed");
      } catch (error) {
        console.log(error);
        toast.error("Unable to remove image");
      }

      return;
    }

    setmultipleSelectedImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
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

    selectedmultipleImages.forEach((img) => {
      if (img instanceof File) {
        form.append("imagesmultiple", img);
      }
    });

    form.append("productname", formData.productname);
    form.append("productcat", formData.productcat);
    form.append(
      "productshortdesc",
      formData.productshortdesc
    );
    form.append("productdesc", formData.productdesc);
    form.append("inventory", formData.inventory);
    form.append("saleprice", formData.saleprice);
    form.append(
      "discountedprice",
      formData.discountedprice
    );
    form.append("productid", formData._id);

    try {
      const result = await updateData(form);

      result.data.map((msg) => {
        msg === "product updated"
          ? toast.success(msg)
          : toast.error(msg);
      });
    } catch (error) {
      console.error("Error submitting form data", error);
      toast.error("Unable to update product");
    }
  };

  if (isLoading) {
    return (
      <div className="edit-product-loading">
        <div className="edit-product-spinner"></div>
        <span>Loading product...</span>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <Sidebarmenu />

      <main className="edit-product-main">
        {/* Header */}
        <header className="edit-product-header">
          <div className="edit-product-heading">
            <Link
              to="/allproducts"
              className="edit-back-btn"
              title="Back to products"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <span className="edit-product-eyebrow">
                PRODUCT MANAGEMENT
              </span>

              <h1>Edit Product</h1>

              <p>
                Update product information, pricing and images.
              </p>
            </div>
          </div>

          <div className="edit-product-status">
            <span></span>
            Editing Product
          </div>
        </header>

        <form
          className="edit-product-layout"
          onSubmit={productsform}
        >
          {/* =========================================
              LEFT COLUMN
          ========================================= */}
          <div className="edit-product-left">
            {/* Basic Information */}
            <section className="edit-card">
              <div className="edit-card-header">
                <div className="edit-card-icon blue">
                  <Package size={18} />
                </div>

                <div>
                  <h2>Basic Information</h2>
                  <p>Product name and category</p>
                </div>
              </div>

              <div className="edit-card-body">
                <div className="edit-form-group">
                  <label htmlFor="productname">
                    Product Name
                  </label>

                  <div className="edit-input-wrapper">
                    <Package size={16} />

                    <input
                      id="productname"
                      type="text"
                      name="productname"
                      value={formData.productname || ""}
                      placeholder="Enter product name"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="productcat">
                    Category
                  </label>

                  <div className="edit-input-wrapper">
                    <Tag size={16} />

                    <select
                      id="productcat"
                      name="productcat"
                      value={formData.productcat || ""}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select category
                      </option>

                      {category?.map((cat, i) => (
                        <option
                          key={i}
                          value={cat.productcat}
                        >
                          {cat.productcat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Descriptions */}
            <section className="edit-card">
              <div className="edit-card-header">
                <div className="edit-card-icon purple">
                  <FileText size={18} />
                </div>

                <div>
                  <h2>Product Description</h2>
                  <p>Describe your product to customers</p>
                </div>
              </div>

              <div className="edit-card-body">
                <div className="edit-form-group">
                  <label htmlFor="productshortdesc">
                    Short Description
                  </label>

                  <textarea
                    id="productshortdesc"
                    name="productshortdesc"
                    value={formData.productshortdesc || ""}
                    placeholder="Write a short product summary..."
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="productdesc">
                    Full Description
                  </label>

                  <textarea
                    id="productdesc"
                    name="productdesc"
                    value={formData.productdesc || ""}
                    placeholder="Write the complete product description..."
                    onChange={handleChange}
                    rows={7}
                  />
                </div>
              </div>
            </section>

            {/* Main Product Image */}
            <section className="edit-card">
              <div className="edit-card-header">
                <div className="edit-card-icon orange">
                  <ImagePlus size={18} />
                </div>

                <div>
                  <h2>Product Image</h2>
                  <p>Main image displayed for your product</p>
                </div>
              </div>

              <div className="edit-card-body">
                <div className="main-image-editor">
                  <div className="main-image-preview">
                    {selectedImage?.src ? (
                      <>
                        <img
                          src={selectedImage.src}
                          alt="Product preview"
                        />

                        <button
                          type="button"
                          className="main-image-remove"
                          onClick={handleDeleteMainImage}
                          title="Remove image"
                        >
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <div className="empty-image-preview">
                        <ImagePlus size={28} />
                        <span>No product image</span>
                      </div>
                    )}
                  </div>

                  <div className="main-image-actions">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />

                    <button
                      type="button"
                      className="upload-image-btn"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <Upload size={16} />
                      {selectedImage?.src
                        ? "Change Image"
                        : "Upload Image"}
                    </button>

                    <span>
                      JPG, PNG or WEBP recommended
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =========================================
              RIGHT COLUMN
          ========================================= */}
          <div className="edit-product-right">
            {/* Pricing & Inventory */}
            <section className="edit-card">
              <div className="edit-card-header">
                <div className="edit-card-icon green">
                  <DollarSign size={18} />
                </div>

                <div>
                  <h2>Pricing & Inventory</h2>
                  <p>Manage stock and product pricing</p>
                </div>
              </div>

              <div className="edit-card-body">
                <div className="edit-form-group">
                  <label htmlFor="inventory">
                    Inventory
                  </label>

                  <div className="edit-input-wrapper">
                    <Boxes size={16} />

                    <input
                      id="inventory"
                      type="number"
                      name="inventory"
                      value={formData.inventory || ""}
                      placeholder="0"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="saleprice">
                    Sale Price
                  </label>

                  <div className="edit-input-wrapper">
                    <DollarSign size={16} />

                    <input
                      id="saleprice"
                      type="number"
                      name="saleprice"
                      value={formData.saleprice || ""}
                      placeholder="0.00"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label htmlFor="discountedprice">
                    Discounted Price
                  </label>

                  <div className="edit-input-wrapper">
                    <DollarSign size={16} />

                    <input
                      id="discountedprice"
                      type="number"
                      name="discountedprice"
                      value={formData.discountedprice || ""}
                      placeholder="0.00"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery */}
            <section className="edit-card">
              <div className="edit-card-header">
                <div className="edit-card-icon pink">
                  <Images size={18} />
                </div>

                <div>
                  <h2>Product Gallery</h2>
                  <p>
                    Add additional images for this product
                  </p>
                </div>
              </div>

              <div className="edit-card-body">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  ref={galleryInputRef}
                  onChange={handlemultiFileChange}
                />

                <button
                  type="button"
                  className="gallery-upload-btn"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                >
                  <ImagePlus size={17} />
                  Add Gallery Images
                </button>

                {/* Existing gallery */}
                {existingGalleryImages.length > 0 && (
                  <div className="gallery-section">
                    <div className="gallery-section-title">
                      <Layers3 size={14} />
                      Existing Images
                      <span>
                        {existingGalleryImages.length}
                      </span>
                    </div>

                    <div className="gallery-grid">
                      {existingGalleryImages.map((img, i) => (
                        <div
                          key={i}
                          className="gallery-image-card"
                        >
                          <img
                            src={`${backendurl}/uploads/${img}`}
                            alt={`Gallery ${i + 1}`}
                          />

                          <button
                            type="button"
                            className="gallery-remove-btn"
                            onClick={(e) =>
                              handlemultiDelete(
                                e,
                                i,
                                img,
                                formData._id
                              )
                            }
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New gallery */}
                {selectedmultipleImages.length > 0 && (
                  <div className="gallery-section new-gallery-section">
                    <div className="gallery-section-title">
                      <Upload size={14} />
                      New Images
                      <span>
                        {selectedmultipleImages.length}
                      </span>
                    </div>

                    <div className="gallery-grid">
                      {selectedmultipleImages.map((img, i) => (
                        <div
                          key={`new-${i}`}
                          className="gallery-image-card new"
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`New gallery ${i + 1}`}
                          />

                          <button
                            type="button"
                            className="gallery-remove-btn"
                            onClick={(e) =>
                              handlemultiDelete(e, i)
                            }
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>

                          <span className="new-image-label">
                            New
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingGalleryImages.length === 0 &&
                  selectedmultipleImages.length === 0 && (
                    <div className="empty-gallery">
                      <Images size={25} />
                      <strong>No gallery images</strong>
                      <span>
                        Add multiple images to showcase your
                        product.
                      </span>
                    </div>
                  )}
              </div>
            </section>

            {/* Save */}
            <div className="edit-save-card">
              <div>
                <strong>Ready to update?</strong>
                <span>
                  Save your latest product changes.
                </span>
              </div>

              <button
                type="submit"
                className="update-product-btn"
                ref={myDivRef}
              >
                <Save size={17} />
                Update Product
              </button>
            </div>

            <Link
              to="/allproducts"
              className="cancel-edit-link"
            >
              <ArrowLeft size={14} />
              Back to All Products
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Editproduct;
