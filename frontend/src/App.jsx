import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Greet, SaveScreenshot, SendMail } from "../wailsjs/go/main/App";
import Teeth from "./teeth";
import FirstTreatment from "./TreatmentText";
import TreatmentInput from "./TreatmentsInput";
import Treatments from "./treatments";
import html2canvas from "html2canvas";

function App() {
  const [resultText, setResultText] = useState("");
  const [name, setName] = useState("");
  const [firstVisitTotal, setFirstVisitTotal] = useState(0);
  const [secondVisitTotal, setSecondVisitTotal] = useState(0);
  const [totalVisitPrice, setTotalVisitPrice] = useState(0);
  const [treatments, setTreatments] = useState([]);
  const [secondTreatments, setSecondTreatments] = useState([]);
  const [filename, setFilename] = useState("screenshot");
  const [clickedTeeth, setClickedTeeth] = useState([]);
  const [firstVisitTotalPriceDefault, setfirstVisitTotalPriceDefault] = useState(0)
  const [secondVisitTotalPriceDefault, setsecondVisitTotalPriceDefault] = useState(0)
  const [screws, setScrews] = useState({})

  
  const hadnleClear = () => {
    setName("");
    setResultText("");
    setFirstVisitTotal(0);
    setSecondVisitTotal(0);
    setTotalVisitPrice(0);
    setTreatments([]);
    setSecondTreatments([]);
    setClickedTeeth([]);
    setFilename("screenshot");
    setfirstVisitTotalPriceDefault(0)
    setsecondVisitTotalPriceDefault(0)
  }


  const updateName = (e) => {
    const enteredName = e.target.value
    setName(enteredName)
    setFilename(`screenshot_${enteredName.replace(/\s+/g, '_')}`);
  };
  const updateResultText = (result) => setResultText(result);
  
  const handleToothClick = (toothNumber, event) => {
    event.stopPropagation()
    setScrews((prevScrews) => {
      const currentState = prevScrews[toothNumber]
      let nextState;
      if (currentState === "screw") {
        nextState = "-"
      } else if (currentState === '-') {
        nextState = undefined
      } else {
        nextState = "screw"
      }
    })
    setClickedTeeth((prevTeeth) => {
      if (prevTeeth.includes(toothNumber)) {
        return prevTeeth.filter((tooth) => tooth !== toothNumber)
      } else {
        return [...prevTeeth, toothNumber]
      }
    })
  } 

  function greet() {
    Greet(name).then(updateResultText);
  }

  const handleAddFirstTreatment = (treatment) => {
    setTreatments((prevTreatments) => [...prevTreatments, treatment]);
  };

  const handleAddSecondTreatment = (treatment) => {
    setSecondTreatments((prevTreatments) => [...prevTreatments, treatment]);
  };

  const handleDeleteTreatment = (index, isSecondTreatment) => {
    if (isSecondTreatment) {
      setSecondTreatments((prev) => prev.filter((_, i) => i !== index));
    } else {
      setTreatments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const firstVisitTotalPrice = treatments.reduce((total, treatment) => {
      return total + treatment.total;
    }, firstVisitTotalPriceDefault);

    const secondVisitTotalPrice = secondTreatments.reduce(
      (total, treatment) => {
        return total + treatment.total;
      },
      secondVisitTotalPriceDefault
    );

    setFirstVisitTotal(firstVisitTotalPrice);
    setSecondVisitTotal(secondVisitTotalPrice);
    setTotalVisitPrice(firstVisitTotalPrice + secondVisitTotalPrice);
  }, [treatments, secondTreatments]);

  const handleScreenshot = async () => {
    const element = document.getElementById("root"); // Capture the entire app div
    if (!element) {
      console.error("App element not found");
      return;
    }
    try {
      const canvas = await html2canvas(element, {
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        scrollX: 0,
        scrollY: -window.screenY 
      });
      const dataUrl = canvas.toDataURL();
      const result = await SaveScreenshot(dataUrl, filename);
      console.log(result);
    } catch (error) {
      console.error("Failed to take screenshot", error);
    }
  };

  const handleSendMail = async () => {
    const data = {
      name,
      clickedTeeth,
      treatments,
      secondTreatments
    }
    console.log("[DATA]", data);
    try {
      const result = await SendMail(data);
      console.log(result)
    } catch(error) {
      console.error("failed to send mail", error)
    }
  }




  return (
    <div id="App">
      <div className="pacientsName">Enter Patient's Name and Surname</div>
      <div id="input" className="input-box">
        <input
          id="name"
          className="input"
          onChange={updateName}
          autoComplete="off"
          name="input"
          type="text"
        />
        <button className="btn" onClick={greet}>
          Enter
        </button>
      </div>
      <div id="result" className="result">
        {resultText}
      </div>
      <div className="content">
        <div className="teethContainer">
          <Teeth onToothClick={handleToothClick} />
        </div>
        <FirstTreatment
          text={"1. Phase: First Visit Treatment (6 days)"}
          price={firstVisitTotal}
        />
        <TreatmentInput onAddTreatment={handleAddFirstTreatment} />
        {treatments.map((treatment, index) => (
          <Treatments
            key={index}
            text={treatment.text}
            quantity={treatment.quantity}
            onePrice={treatment.onePrice}
            total={treatment.total}
            onDelete={() => handleDeleteTreatment(index, false)}
          />
        ))}
        <FirstTreatment
          text={"2. Phase: Second Visit Treatment (7 days)"}
          price={secondVisitTotal}
        />
        <TreatmentInput
          onAddTreatment={handleAddSecondTreatment}
          secondTreatment={true}
        />
        {secondTreatments.map((treatment, index) => (
          <Treatments
            key={index}
            text={treatment.text}
            quantity={treatment.quantity}
            onePrice={treatment.onePrice}
            total={treatment.total}
            secondTreatment={true}
            onDelete={() => handleDeleteTreatment(index, true)}
          />
        ))}
        <FirstTreatment text={"Total Price Result"} price={totalVisitPrice} />
      </div>
      <div className="btnCollection">
        <button onClick={handleScreenshot}>
          Take Screenshot
        </button>
        <button onClick={handleSendMail} >
          send mail
        </button>
        <button onClick={hadnleClear}>
          clear
        </button>
      </div>
    </div>
  );
}

export default App;
