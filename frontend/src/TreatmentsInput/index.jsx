import React, { useState } from "react";
import "./index.css";

const TreatmentInput = ({ onAddTreatment, quantity, clickedTeeth }) => {
  const [disease, setDisease] = useState("");
  const [text, setText] = useState("");
  const [onePrice, setOnePrice] = useState("");
  const [error, setError] = useState("")

  // console.log(clickedTeeth)

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value) {
      setError("")
    }
  }

  const handleDiseaseChange = (e) => {
    setDisease(e.target.value)
    if (e.target.value) {
      setError("")
    }
  }

  const handlePriceChange = (e) => {
    const value = e.target.value
    if (!isNaN(value) && Number(value) >= 0) {
      setOnePrice(value)
    }
  }

  const handleAddTreatment = () => {
    const total = onePrice * quantity; 
    if (!text) {
      setError("please provide treatment name")
      return;
    }
    onAddTreatment({ disease,text, onePrice, total });
    // Clear the input fields after adding the treatment
    setText("");
    setDisease("")
    setOnePrice("");
  };



  return (
    <div className="TreatmentsList">
      <div className="TreatmentsInner">
        <div>
        teeth: {clickedTeeth.join(", ")} <p>quantity: {quantity}x</p>
        </div>
        <div>
        <input
            type="text"
            value={disease}
            onChange={handleDiseaseChange}
            placeholder="Disease"
            className="inputs"
          />
        </div>
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
            value={onePrice}
            onChange={handlePriceChange}
            placeholder="One Item Price"
            className="inputs"
          />
        </div>
        <div>
          <p className="total">${onePrice * quantity}</p>
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
