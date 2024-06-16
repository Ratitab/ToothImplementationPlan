import React, { useState } from "react";
import "./index.css";

const TreatmentInput = ({ onAddTreatment, secondTreatment }) => {
  const [text, setText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [onePrice, setOnePrice] = useState(0);

  const handleTextChange = (e) => setText(e.target.value);
  const handleQuantityChange = (e) => setQuantity(Number(e.target.value));
  const handlePriceChange = (e) => setOnePrice(Number(e.target.value));

  const handleAddTreatment = () => {
    const total = quantity * onePrice;
    onAddTreatment({ text, quantity, onePrice, total });
    // Clear the input fields after adding the treatment
    setText("");
    setQuantity(1);
    setOnePrice(0);
  };

  return (
    <div className="TreatmentsList">
      <div className="TreatmentsInner">
        <div>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Treatment"
            className="inputs"
          />
        </div>
        <div>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            placeholder="Quantity"
            className="inputs"
          />
        </div>
        <div>
          <input
            type="number"
            value={onePrice}
            onChange={handlePriceChange}
            placeholder="Price"
            className="inputs"
          />
        </div>
        <div>
          <p className="total">${quantity * onePrice}</p>
        </div>
        <div>
          <button onClick={handleAddTreatment} className="add-button">
            Add Treatment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentInput;
