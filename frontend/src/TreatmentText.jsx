import "./TreatmentText.css";

const FirstTreatment = ({text, price}) => {
  return (
    <div className="FirstTreatment">
      <div>
        <p>{text}</p>
      </div>
      <div className="price">
        <p>Total Price: ${price}</p>
      </div>
    </div>
  );
};

export default FirstTreatment;
