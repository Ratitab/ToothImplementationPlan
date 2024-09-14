import "./TreatmentText.css";
import trashCan from './assets/images/trash.png'

const FirstTreatment = ({text, price, onDelete, isGel}) => {

  const currencySymbol = isGel ? "₾" : "$"
  return (
    <div className="FirstTreatment">
      <div>
        <p>{text}</p>
      </div>
      <div className="price">
        <p>Total Price: <span className="currency-symbol">{currencySymbol}</span>{price}</p>
      </div>
      <div className="deletePhase" onClick={onDelete} >
        <img src={trashCan} alt="trashcan" width="20px" />
      </div>
    </div>
  );
};

export default FirstTreatment;
