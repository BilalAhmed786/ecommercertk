import React, { useEffect, useRef, useState } from "react";
import {
  PackagePlus,
  ImagePlus,
  Images,
  Tag,
  Boxes,
  DollarSign,
  FileText,
  X,
  Upload,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

import Sidebarmenu from "./component/Sidebarmenu";
import {
  useSubmitProductDataMutation,
  useGetProductCategeroyQuery,
} from "../app/apiproducts";

function Addproduct() {
  const fileInputRef = useRef(null);
  const multipleFileInputRef = useRef(null);

  const [submitData, { isLoading }] = useSubmitProductDataMutation();

  const { data: categories = [] } = useGetProductCategeroyQuery("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMultipleImages, setSelectedMultipleImages] = useState([]);

  const [formData, setFormData] = useState({
    productname: "",
    productcat: "",
    productshortdesc: "",
    productdesc: "",
    inventory: "",
    saleprice: "",
    discountedprice: "",
  });

  /* -----------------------------
     Main image
  ----------------------------- */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const src = URL.createObjectURL(file);

    setSelectedImage((previous) => {
      if (previous?.src) {
        URL.revokeObjectURL(previous.src);
      }

      return {
        file,
        src,
      };
    });
  };

  const handleDeleteMainImage = (event) => {
    event.preventDefault();

    setSelectedImage((previous) => {
      if (previous?.src) {
        URL.revokeObjectURL(previous.src);
      }

      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* -----------------------------
     Gallery images
  ----------------------------- */

  const handleMultiFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error("Only image files can be added to the gallery.");
    }

    const newImages = imageFiles.map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));

    setSelectedMultipleImages((previous) => [...previous, ...newImages]);

    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.value = "";
    }
  };

  const handleMultiDelete = (event, index) => {
    event.preventDefault();

    setSelectedMultipleImages((previous) => {
      const imageToRemove = previous[index];

      if (imageToRemove?.src) {
        URL.revokeObjectURL(imageToRemove.src);
      }

      return previous.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  /* -----------------------------
     Input changes
  ----------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* -----------------------------
     Submit
  ----------------------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.productname.trim()) {
      toast.error("Please enter product name.");
      return;
    }

    if (!formData.productcat) {
      toast.error("Please select a product category.");
      return;
    }

    if (!selectedImage?.file) {
      toast.error("Please select a product image.");
      return;
    }

    const form = new FormData();

    form.append("singleimage", selectedImage.file);

    selectedMultipleImages.forEach((image) => {
      form.append("multipleimages", image.file);
    });

    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const result = await submitData(form);

      if (result?.data) {
        const messages = Array.isArray(result.data)
          ? result.data
          : [result.data];

        messages.forEach((message) => {
          if (message === "Product saved successfully") {
            toast.success(message);

            setFormData({
              productname: "",
              productcat: "",
              productshortdesc: "",
              productdesc: "",
              inventory: "",
              saleprice: "",
              discountedprice: "",
            });

            setSelectedImage((previous) => {
              if (previous?.src) {
                URL.revokeObjectURL(previous.src);
              }

              return null;
            });

            setSelectedMultipleImages((previous) => {
              previous.forEach((image) => {
                if (image.src) {
                  URL.revokeObjectURL(image.src);
                }
              });

              return [];
            });

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            if (multipleFileInputRef.current) {
              multipleFileInputRef.current.value = "";
            }
          } else {
            toast.error(message);
          }
        });
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Something went wrong while saving the product.");
    }
  };

  /* -----------------------------
     Cleanup object URLs
  ----------------------------- */

  useEffect(() => {
    return () => {
      if (selectedImage?.src) {
        URL.revokeObjectURL(selectedImage.src);
      }

      selectedMultipleImages.forEach((image) => {
        if (image.src) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, []);

  return (
    <div className="add-product-page">
      <Sidebarmenu />

      <main className="add-product-main">
        {/* Header */}
        <div className="add-product-header">
          <div>
            <div className="add-product-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <strong>Products</strong>
            </div>

            <h1>
              Add New Product
              <Sparkles size={22} />
            </h1>

            <p>
              Create a beautiful product listing with images, pricing and
              inventory information.
            </p>
          </div>

          <div className="add-product-header-icon">
            <PackagePlus size={30} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="add-product-layout">
            {/* LEFT SIDE */}
            <section className="add-product-left">
              {/* Basic Information */}
              <div className="add-product-card">
                <div className="add-product-card-header">
                  <div className="add-product-card-icon blue">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2>Basic Information</h2>
                    <p>Enter the main details of your product.</p>
                  </div>
                </div>

                <div className="add-product-form">
                  <div className="add-product-form-group full">
                    <label>
                      Product Name <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="productname"
                      value={formData.productname}
                      onChange={handleChange}
                      placeholder="e.g. Premium Cotton T-Shirt"
                    />
                  </div>

                  <div className="add-product-form-group full">
                    <label>
                      Product Category <span>*</span>
                    </label>

                    <select
                      name="productcat"
                      value={formData.productcat}
                      onChange={handleChange}
                    >
                      <option value="">Select product category</option>

                      {categories.map((category, index) => (
                        <option
                          key={category._id || category.id || index}
                          value={category.productcat}
                        >
                          {category.productcat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="add-product-form-group full">
                    <label>
                      Short Description <span>*</span>
                    </label>

                    <textarea
                      name="productshortdesc"
                      value={formData.productshortdesc}
                      onChange={handleChange}
                      placeholder="Write a short description of your product..."
                      rows="4"
                    />
                  </div>

                  <div className="add-product-form-group full">
                    <label>
                      Full Description <span>*</span>
                    </label>

                    <textarea
                      name="productdesc"
                      value={formData.productdesc}
                      onChange={handleChange}
                      placeholder="Describe your product in detail..."
                      rows="7"
                    />
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="add-product-card">
                <div className="add-product-card-header">
                  <div className="add-product-card-icon purple">
                    <ImagePlus size={20} />
                  </div>

                  <div>
                    <h2>Product Image</h2>
                    <p>Upload the main image customers will see.</p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />

                {!selectedImage ? (
                  <button
                    type="button"
                    className="main-image-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">
                      <Upload size={27} />
                    </div>

                    <strong>Upload Product Image</strong>

                    <span>
                      PNG, JPG, JPEG or WEBP
                      <br />
                      Click to browse your files
                    </span>
                  </button>
                ) : (
                  <div className="main-image-editor">
                    <div className="main-image-preview">
                      <img
                        src={selectedImage.src}
                        alt="Product preview"
                      />

                      <div className="main-image-overlay">
                        <button
                          type="button"
                          onClick={handleDeleteMainImage}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="main-image-info">
                      <div>
                        <CheckCircle2 size={18} />
                        <span>Product image selected</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="add-product-card">
                <div className="add-product-card-header">
                  <div className="add-product-card-icon orange">
                    <Images size={20} />
                  </div>

                  <div>
                    <h2>Product Gallery</h2>
                    <p>Add additional images to showcase your product.</p>
                  </div>
                </div>

                <input
                  ref={multipleFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiFileChange}
                  hidden
                />

                <button
                  type="button"
                  className="gallery-upload-btn"
                  onClick={() => multipleFileInputRef.current?.click()}
                >
                  <ImagePlus size={19} />
                  Add Gallery Images
                </button>

                {selectedMultipleImages.length > 0 && (
                  <div className="gallery-grid">
                    {selectedMultipleImages.map((image, index) => (
                      <div className="gallery-image-card" key={index}>
                        <img
                          src={image.src}
                          alt={`Gallery ${index + 1}`}
                        />

                        <button
                          type="button"
                          onClick={(event) =>
                            handleMultiDelete(event, index)
                          }
                        >
                          <X size={15} />
                        </button>

                        <span>{index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedMultipleImages.length === 0 && (
                  <div className="empty-gallery">
                    <Images size={35} />
                    <p>No gallery images added yet</p>
                    <span>Add multiple images to create a gallery.</span>
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT SIDE */}
            <aside className="add-product-right">
              {/* Pricing */}
              <div className="add-product-card">
                <div className="add-product-card-header">
                  <div className="add-product-card-icon green">
                    <DollarSign size={20} />
                  </div>

                  <div>
                    <h2>Pricing</h2>
                    <p>Set your product prices.</p>
                  </div>
                </div>

                <div className="add-product-form">
                  <div className="add-product-form-group full">
                    <label>
                      Sale Price <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <span className="currency-symbol">$</span>

                      <input
                        type="number"
                        name="saleprice"
                        value={formData.saleprice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="add-product-form-group full">
                    <label>Discounted Price</label>

                    <div className="input-with-icon">
                      <span className="currency-symbol">$</span>

                      <input
                        type="number"
                        name="discountedprice"
                        value={formData.discountedprice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="add-product-card">
                <div className="add-product-card-header">
                  <div className="add-product-card-icon pink">
                    <Boxes size={20} />
                  </div>

                  <div>
                    <h2>Inventory</h2>
                    <p>Manage product stock.</p>
                  </div>
                </div>

                <div className="add-product-form">
                  <div className="add-product-form-group full">
                    <label>
                      Stock Quantity <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Boxes size={18} />

                      <input
                        type="number"
                        name="inventory"
                        value={formData.inventory}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="inventory-tip">
                  <Tag size={16} />
                  <span>
                    Keep inventory updated to avoid overselling.
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="product-summary-card">
                <div className="summary-icon">
                  <PackagePlus size={22} />
                </div>

                <div>
                  <h3>Ready to publish?</h3>

                  <p>
                    Review your product information before adding it to
                    your store.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                className="create-product-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <PackagePlus size={20} />
                    Create Product
                  </>
                )}
              </button>

              <p className="required-note">
                <span>*</span> Required fields
              </p>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Addproduct;
