import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaHeart,
  FaGem,
  FaLeaf,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import bannerImage from "../assets/about-banner.jpg";
import loaderGif from "../assets/laoder.gif";

const AboutUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="shop-loader">
        <img src={loaderGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <img
          src={bannerImage}
          alt="Thrifters Point fashion collection"
          className="about-hero-image"
        />

        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">

          <span className="about-eyebrow">
            THRIFTERS' POINT
          </span>

          <h1>
            Fashion with a
            <span> story.</span>
          </h1>

          <p>
            Carefully selected fashion, timeless pieces and
            high-end style — without the high-end price.
          </p>

          <Link to="/" className="about-hero-button">
            Explore Collection
            <FaArrowRight />
          </Link>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="about-intro">

        <div className="about-intro-heading">

          <span>WHO WE ARE</span>

          <h2>
            We believe great style
            <br />
            shouldn't cost a fortune.
          </h2>

        </div>

        <div className="about-intro-text">

          <p>
            Thrifters' Point is an online thrift store created
            for people who love fashion, individuality and
            finding something truly special.
          </p>

          <p>
            Every item we offer is carefully handpicked from
            different thrift bazaars. We look beyond trends
            to find pieces that bring together quality,
            character and affordability.
          </p>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="about-stats">

        <div className="about-stat">
          <strong>2023</strong>
          <span>Founded</span>
        </div>

        <div className="about-stat">
          <strong>100%</strong>
          <span>Handpicked</span>
        </div>

        <div className="about-stat">
          <strong>∞</strong>
          <span>Unique Finds</span>
        </div>

        <div className="about-stat">
          <strong>1</strong>
          <span>Fashion Community</span>
        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="about-story">

        <div className="about-story-image">

          <img
            src={bannerImage}
            alt="Our story"
          />

          <div className="story-floating-card">

            <FaGem />

            <div>
              <strong>Curated with care</strong>
              <span>Every piece tells a story</span>
            </div>

          </div>

        </div>


        <div className="about-story-content">

          <span className="section-label">
            OUR STORY
          </span>

          <h2>
            From thrift bazaars
            <br />
            to your doorstep.
          </h2>

          <p>
            What started in 2023 with a simple idea has grown
            into a place where fashion lovers can discover
            quality pieces at prices they can actually enjoy.
          </p>

          <p>
            We personally search through thrift collections
            to discover pieces worth bringing home. From
            timeless classics to unexpected finds, our goal
            is to make every purchase feel exciting and unique.
          </p>

          <div className="story-points">

            <div>
              <FaCheckCircle />
              <span>Carefully selected products</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Affordable high-end fashion</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Unique pieces with character</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section className="about-mission">

        <div className="mission-content">

          <span className="section-label">
            OUR MISSION
          </span>

          <h2>
            Make fashion
            <br />
            <span>more accessible.</span>
          </h2>

          <p>
            Our mission is simple: bring beautiful, quality
            fashion to more people while creating a shopping
            experience built around trust, affordability and
            individuality.
          </p>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values">

        <div className="values-heading">

          <span className="section-label">
            WHAT WE STAND FOR
          </span>

          <h2>
            More than just
            <br />
            <span>thrift.</span>
          </h2>

        </div>


        <div className="values-grid">

          <div className="value-card">

            <div className="value-icon">
              <FaGem />
            </div>

            <h3>Quality First</h3>

            <p>
              We carefully select every item so you receive
              products that are worth adding to your wardrobe.
            </p>

          </div>


          <div className="value-card">

            <div className="value-icon">
              <FaHeart />
            </div>

            <h3>Curated with Love</h3>

            <p>
              We don't simply collect products. We search
              for pieces that have character and personality.
            </p>

          </div>


          <div className="value-card">

            <div className="value-icon">
              <FaLeaf />
            </div>

            <h3>Thrift Mindset</h3>

            <p>
              Giving fashion another life means discovering
              great style while making more thoughtful choices.
            </p>

          </div>


          <div className="value-card">

            <div className="value-icon">
              <FaUsers />
            </div>

            <h3>Our Community</h3>

            <p>
              Our customers are at the heart of everything
              we do. We're building a community around style.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW WE WORK
      ===================================================== */}

      <section className="about-process">

        <div className="process-heading">

          <span className="section-label">
            THE THRIFTERS' POINT WAY
          </span>

          <h2>
            How we find your
            <br />
            next favorite piece.
          </h2>

        </div>


        <div className="process-grid">

          <div className="process-card">

            <span className="process-number">01</span>

            <div className="process-icon">
              <FaShoppingBag />
            </div>

            <h3>We Search</h3>

            <p>
              We explore thrift bazaars and collections
              looking for hidden gems.
            </p>

          </div>


          <div className="process-card">

            <span className="process-number">02</span>

            <div className="process-icon">
              <FaCheckCircle />
            </div>

            <h3>We Select</h3>

            <p>
              Only pieces that meet our standards make
              it into our collection.
            </p>

          </div>


          <div className="process-card">

            <span className="process-number">03</span>

            <div className="process-icon">
              <FaHeart />
            </div>

            <h3>You Discover</h3>

            <p>
              You discover something unique and give it
              a new place in your wardrobe.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div className="about-cta-content">

          <span>READY TO FIND SOMETHING SPECIAL?</span>

          <h2>
            Your next favorite
            <br />
            piece is waiting.
          </h2>

          <p>
            Explore our latest collection and discover
            fashion with a story.
          </p>

          <Link to="/" className="about-cta-button">
            Start Shopping
            <FaArrowRight />
          </Link>

        </div>

      </section>

    </div>
  );
};

export default AboutUs;
