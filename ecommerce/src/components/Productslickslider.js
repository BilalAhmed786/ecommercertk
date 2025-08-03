import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { backendurl } from '../baseurl/baseurl';

function ProductSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainSliderRef = useRef(null);

  const mainSliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentIndex(next),
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    mainSliderRef.current?.slickGoTo(index);
  };

  return (
    <div className="productslider-wrapper">
      <div className='listslidewraper'>
        <div className="thumbnail-list">
          {images.map((img, index) => (
            <div
              key={index}
              className={`thumb-img ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img src={`${backendurl}/uploads/${img}`} alt="" />
            </div>
          ))}
        </div>

        <div className="main-slider">
          <Slider {...mainSliderSettings} ref={mainSliderRef}>
            {images.map((img, index) => (
              <div key={index}>
                <img src={`${backendurl}/uploads/${img}`} alt="" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ProductSlider;
