// src/components/ButtonCollection.js

import React from "react";
import "./index.css"; // Create a separate CSS file for styling if needed

const ButtonCollection = ({ buttons }) => {
  return (
    <div className="btnCollection">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="btnFromCol"
          onClick={button.onClick}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};

export default ButtonCollection;
