import React, { useState } from "react";
import "./index.css";
import { SearchDiseases, SearchTreatments } from "../../wailsjs/go/main/App";

const TreatmentInput = ({ onAddTreatment, quantity, clickedTeeth }) => {
  const [disease, setDisease] = useState("");
  const [text, setText] = useState("");
  const [onePrice, setOnePrice] = useState("");
  const [error, setError] = useState("");
  const [diseaseSuggestions, setdiseaseSuggestions] = useState([]);
  const [treatmentSuggestions, setTreatmentSuggestions] = useState([])

  const fetchTreatmentSuggestions = async (query) => {
    if (query.length > 1) {
      try {
        const response = await SearchTreatments(query)
        if (response !== null) {
          setTreatmentSuggestions(response)
        } 
      } catch {
        console.error("cant fetch suggestions")
      }
    } else {
      setTreatmentSuggestions([])
    }
  }

  const fetchdiseaseSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const response = await SearchDiseases(query);
        if (response !== null) {
          setdiseaseSuggestions(response);
        }
      } catch (error) {
        console.error("Error fetching diseaseSuggestions", error);
      }
    } else {
      setdiseaseSuggestions([]);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    fetchTreatmentSuggestions(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  const handleDiseaseChange = (e) => {
    setDisease(e.target.value);
    fetchdiseaseSuggestions(e.target.value);
    if (e.target.value) {
      setError("");
    }
  };

  const handleDiseaseSuggestionClick = (suggestion) => {
    setDisease(suggestion.Name)
    setdiseaseSuggestions([])
  }

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setOnePrice(value);
    }
  };

  const handleAddTreatment = () => {
    const total = onePrice * quantity;
    if (!text) {
      setError("Please provide treatment name");
      return;
    }
    onAddTreatment({ disease, text, onePrice, total });
    // Clear the input fields after adding the treatment
    setText("");
    setDisease("");
    setOnePrice("");
  };

  const handleTreatmentSuggestionList = (suggestion) => {
    setText(suggestion.Name)
    setTreatmentSuggestions([])
  }

  return (
    <div className="TreatmentsList">
      <div className="TreatmentsInner">
        <div>
          Teeth: {clickedTeeth.join(", ")} <p>Quantity: {quantity}x</p>
        </div>
        <div style={{position: 'relative'}}>
          <input
            type="text"
            value={disease}
            onChange={handleDiseaseChange}
            placeholder="Disease"
            className="inputs"
          />
          {diseaseSuggestions.length > 0 && (
            <ul className="suggestion-list">
              {diseaseSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleDiseaseSuggestionClick(suggestion)}>
                  {suggestion.Name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{position: 'relative'}}>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Treatment"
            className="inputs"
          />
          {treatmentSuggestions.length > 0 && (
            <ul className="suggestion-list">
              {treatmentSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleTreatmentSuggestionList(suggestion)}>
                  {suggestion.Name}
                </li>
              ))}
            </ul>
          )}
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
        {!text && error}
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
