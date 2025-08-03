import React, { useState, useEffect } from 'react';

function Clientprorating({ rating }) {

    const [stars, setStars] = useState([]);

    useEffect(() => {
      const renderStars = () => {
        const starArray = [];
        for (let i = 1; i <= 5; i++) {
          let color;
          if (i <= rating) {
            if (i <= 2) {
              color = 'gold'; // Color the stars gold for ratings less than or equal to 2
            } else {
              color = 'blue'; // Color the stars blue for ratings greater than 2
            }
          } else {
            color = 'colorless'; // Leave stars colorless for ratings greater than i
          }
          starArray.push(
            <span className='clientratings'
              key={i}
              style={{
                cursor: 'default',
                color: color
              }}
            >
              ★
            </span>
          );
        }
        setStars(starArray);
      };
  
      renderStars();
    }, [rating]);
  
    return <div>{stars}</div>;

}

export default Clientprorating