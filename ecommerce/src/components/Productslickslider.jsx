import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { backendurl } from "../baseurl/baseurl";

function ProductSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainSliderRef = useRef(null);

  const mainSliderSettings = {
    arrows: true,
    dots: false,
    infinite: images.length > 1,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,

    beforeChange: (_, next) => {
      setCurrentIndex(next);
    },
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    mainSliderRef.current?.slickGoTo(index);
  };

  if (!images.length) {
    return (
      <div className="empty-product-image">
        <span>🛍️</span>
        <p>No image available</p>
      </div>
    );
  }

  return (
    <div className="productslider-wrapper">

      <div className="product-gallery-inner">

        {/* THUMBNAILS */}

        <div className="thumbnail-list">

          {images.map((img, index) => (

            <button
              type="button"
              key={index}
              className={`thumb-img ${
                index === currentIndex
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleThumbnailClick(index)
              }
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={`${backendurl}/uploads/${img}`}
                alt={`Product ${index + 1}`}
              />
            </button>

          ))}

        </div>


        {/* MAIN IMAGE */}

        <div className="main-slider">

          <Slider
            {...mainSliderSettings}
            ref={mainSliderRef}
          >

            {images.map((img, index) => (

              <div
                key={index}
                className="main-slide"
              >
                <div className="main-image-container">

                  <img
                    src={`${backendurl}/uploads/${img}`}
                    alt={`Product view ${index + 1}`}
                  />

                </div>
              </div>

            ))}

          </Slider>

        </div>

      </div>

    </div>
  );
}

export default ProductSlider;