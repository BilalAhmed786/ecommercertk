import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

 export const settings = {
      dots: false,
      infinite: true,
      speed: 200,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      arrows:false,
      autoplaySpeed: 2000,
      responsive: [
        { //for media
          breakpoint: 750,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },  { //for media
          breakpoint: 1050,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600, //for media

          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
      ]
    };


