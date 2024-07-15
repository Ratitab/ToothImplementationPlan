import React from "react";
import "./index.css";

const Treatments = ({
  text,
  disease,
  quantity,
  onePrice,
  clickedTeeth,
  secondTreatment,
  onDelete,
}) => {
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
        {!secondTreatment && (
          <div>
            <p>${onePrice}</p>
          </div>
        )}
        <div>
          <p>${quantity * onePrice}</p>
        </div>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Treatments;
