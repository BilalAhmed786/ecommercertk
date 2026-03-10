import React, { useEffect, useState } from "react";
import bannerImage from "../assets/about-banner.jpg";
import loaderGif from "../assets/laoder.gif"; // same loader you use in shop

const AboutUs = () => {
  const [loading, setLoading] = useState(true);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fake loader (for smooth UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // adjust timing if needed

    return () => clearTimeout(timer);
  }, []);

  // Loader
  if (loading) {
    return (
      <div className="shop-loader">
        <img src={loaderGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="aboutus-container">
      {/* Banner Section */}
      <section className="banner">
        <img src={bannerImage} alt="About Us Banner" />
      </section>

      {/* Content Section */}
      <section className="content fade-in">
        <h2>Our Story</h2>
        <p>
          Founded in 2023, our company started with a simple idea: to make
          everyday shopping easier, smarter, and more enjoyable. Through
          dedication, innovation, and commitment to our customers, we’ve grown
          into a trusted brand known for quality and reliability.
        </p>
      </section>

      <section className="content fade-in delay-1">
        <h2>Our Mission</h2>
        <p>
          To provide exceptional products and services that make life easier,
          and to build lasting relationships with our customers through
          transparency, innovation, and a commitment to excellence.
        </p>
      </section>

      <section className="content fade-in delay-2">
        <h2>Join Our Journey</h2>
        <p>
          We’re always looking for talented people and partners to grow with us.
          Reach out today and become part of our story.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;