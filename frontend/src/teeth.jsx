import React, { useImperativeHandle, useState, forwardRef } from "react";
import teethSvg from "./assets/images/tooth.png";
import "./teeth.css";

const Teeth = forwardRef(({ onToothClick }, ref) => {
  const [teethStatus, setTeethStatus] = useState({});
  
  useImperativeHandle(ref, () => ({
    setTeethStatus(status) {
      setTeethStatus(status);
    },
    clearTeeth() {
      setTeethStatus({});
    },
    getClickedTeeth() {
      return Object.entries(teethStatus)
        .filter(([_, status]) => status === "star")
        .map(([number]) => parseInt(number));
    },
  }));

  const handleToothClick = (number, event) => {
    event.stopPropagation();
    setTeethStatus((prevStatus) => {
      const currentState = prevStatus[number];
      const nextState = currentState === "star" ? undefined : "star";
      const updatedStatus = { ...prevStatus, [number]: nextState };
      onToothClick(number, nextState);
      return updatedStatus;
    });
  };

  return (
    <div className="teethContainer">
      <div className="upper-teeth">
        {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map(
          (number) => (
            <div key={number} onClick={(e) => handleToothClick(number, e)}>
              {teethStatus[number] === "star" && (
                <div className="star">
                  ★
                </div>
              )}
              <img src={teethSvg} width={60} alt="tooth" />
              <p>{number}</p>
            </div>
          )
        )}
      </div>
      <div className="bottom-teeth">
        {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(
          (number) => (
            <div key={number} onClick={(e) => handleToothClick(number, e)}>
              {teethStatus[number] === "star" && (
                <div className="star">
                  ★
                </div>
              )}
              <img src={teethSvg} width={60} alt="tooth" />
              <p>{number}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
});

export default Teeth;
