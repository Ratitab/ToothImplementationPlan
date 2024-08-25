import "./TreatmentText.css";
import trashCan from './assets/images/trash.png'
import SwitchButton from "./switchButton";

const FirstTreatment = ({text, price, onDelete, isFinal = false}) => {
  return (
    <div className="FirstTreatment">
      <div>
        <p>{text}</p>
      </div>
      <div className="price">
        <p>Total Price: ${price}</p>
      </div>
      {isFinal && <SwitchButton />}
      <div className="deletePhase" onClick={onDelete} >
        <img src={trashCan} alt="trashcan" width="20px" />
      </div>
    </div>
  );
};

export default FirstTreatment;
