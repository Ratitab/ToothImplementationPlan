import React from "react";
import "./index.css";

const Treatments = ({ text, quantity, onePrice, total, secondTreatment, onDelete }) => {
  return (
    <div className="TreatmentsList">
      <div className="TreatmentsInner">
        <div>
          <p>{text}</p>
        </div>
        <div>
          <p>{quantity}x</p>
        </div>
        {!secondTreatment && (
          <div>
            <p>${onePrice}</p>
          </div>
        )}
        <div>
          <p>${total}</p>
        </div>
        <button className="delete-button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default Treatments;
