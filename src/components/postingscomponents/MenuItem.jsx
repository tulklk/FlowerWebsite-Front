import React from "react";
// import "src/components/menucomponents/MenuItem.css";

function MenuItem({ image, name, price }) {
  return (
    <div className="card h-100">
      <img className="card-img-top" src={image} alt={name} />
      <div className="card-body">
        <h4 className="card-title">{name}</h4>
        <h5>${price}</h5>
        <p className="card-text">A beautiful collection of seasonal flowers for your loved ones.</p>
      </div>
      <div className="card-footer">
        <small className="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
      </div>
    </div>
  );
}

export default MenuItem;
