import React from "react";

function Clientprorating({ rating }) {
  const numericRating = Number(rating) || 0;

  return (
    <div className="client-rating">

      {[1, 2, 3, 4, 5].map((index) => (

        <span
          key={index}
          className={
            index <= numericRating
              ? "client-star active"
              : "client-star"
          }
        >
          ★
        </span>

      ))}

    </div>
  );
}

export default Clientprorating;