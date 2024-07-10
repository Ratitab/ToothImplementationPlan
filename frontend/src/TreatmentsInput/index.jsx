import React, { useState } from "react";
import "./index.css";

const TreatmentInput = ({ onAddTreatment, secondTreatment }) => {
  const [text, setText] = useState("");
  const [quantity, setQuantity] = useState("");
  const [onePrice, setOnePrice] = useState("");
  const [error, setError] = useState("")

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value) {
      setError("")
    }
  }
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setQuantity(value);
    }

  }
  const handlePriceChange = (e) => {
    const value = e.target.value
    if (!isNaN(value) && Number(value) >= 0) {
      setOnePrice(value)
    }
  }

  const handleAddTreatment = () => {
    const total = quantity * onePrice;
    if (!text) {
      setError("please provide treatment name")
      return;
    }
    onAddTreatment({ text, quantity, onePrice, total });
    // Clear the input fields after adding the treatment
    setText("");
    setQuantity("");
    setOnePrice("");
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
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Quantity"
            className="inputs"
          />
        </div>
        <div>
          <input
            type="text"
            value={onePrice}
            onChange={handlePriceChange}
            placeholder="Price"
            className="inputs"
          />
        </div>
        <div>
          <p className="total">${quantity * onePrice}</p>
        </div>
        {!text && error }
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
