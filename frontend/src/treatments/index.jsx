import React, { useState } from "react";
import "./index.css";

const Treatments = ({
  text,
  disease,
  quantity,
  onePrice,
  comment,
  secondTreatment,
  onDelete,
  visibleDeleteButton,
  isGel,
}) => {

  const currencySymbol = isGel ? "₾" : "$"

  // console.log("[clicked teeth arr]", clickedTeeth);
  return (
    <div className="TreatmentsList">
      <div className="TreatmentsInner">
        <div>
          <p>{disease}</p>
        </div>
        <div>
          <p>{text}</p>
        </div>
        <div>
          <p>{comment}</p>
        </div>
        {!secondTreatment && (
          <div>
            <p>
              <span className="currency-symbol"></span>
              {onePrice}
            </p>
          </div>
        )}
        <div>
          <p>
            <span className="currency-symbol">{currencySymbol}</span>
            {quantity * onePrice}
          </p>
        </div>
        {visibleDeleteButton && (
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Treatments;
