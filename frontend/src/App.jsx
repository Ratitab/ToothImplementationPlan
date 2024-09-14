import { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Greet,
  SaveScreenshot,
  SendMail,
  StorePacientsData,
  GetPacientsData,
  CheckPaymentStatus,
  GetCurrency,
} from "../wailsjs/go/main/App";
import Teeth from "./teeth";
import FirstTreatment from "./TreatmentText";
import TreatmentInput from "./TreatmentsInput";
import Treatments from "./treatments";
import html2canvas from "html2canvas";
import LoginComponent from "./login";
import ButtonCollection from "./buttonCollection";
import IsNotPaid from "./isNotPaid";
import DatePicker from "react-datepicker";
import CheckAppVersion from "./checkVersion";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { is } from "date-fns/locale";

function App() {
  const [resultText, setResultText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [filename, setFilename] = useState("screenshot");
  const [clickedTeeth, setClickedTeeth] = useState({});
  const [exchangeRate, setExchangeRate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [phases, setPhases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newPhaseDays, setNewPhaseDays] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [phaseCounter, setPhaseCounter] = useState(1);
  const [isPaid, setIsPaid] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGel, setIsGel] = useState(false);
  const [visibleHeadings, setVisibleHeadings] = useState(false);
  const teethRef = useRef();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const result = await CheckPaymentStatus();
        console.log("egereve resulti", result);
        if (!result) {
          setIsPaid(false);
        }
      } catch (error) {
        console.log("error checking payment status: ", error);
        setIsPaid(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await GetCurrency();
      const data = await response.json();
      console.log("[DATA]", data);
      setExchangeRate(data.CurrencyResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrencyChange = () => {
    setIsGel(!isGel)
  };

  const handleClear = () => {
    setName("");
    setResultText("");
    setPhases([]);
    setClickedTeeth({});
    setFilename("screenshot");
    setEmail("");

    const inputElementName = document.getElementById("name");
    if (inputElementName) {
      inputElementName.value = "";
    }

    const inputElementEmail = document.getElementById("email");
    if (inputElementEmail) {
      inputElementEmail.value = "";
    }

    if (teethRef.current) {
      teethRef.current.clearTeeth();
    }
  };

  const updateName = (e) => {
    const enteredName = e.target.value;
    setName(enteredName);
    setFilename(`screenshot_${enteredName.replace(/\s+/g, "_")}`);
  };

  const updateResultText = (result) => setResultText(result);

  const handleToothClick = (toothNumber, status) => {
    setClickedTeeth((prevTeeth) => ({
      ...prevTeeth,
      [toothNumber]: status,
    }));
  };

  const greet = async () => {
    if (email === "" || name === "") {
      Swal.fire({
        icon: "warning",
        title: "no name and email selected",
        text: "please provide name and email"
      })
      return;
    }
    Greet(name).then(updateResultText);
    try {
      const result = await GetPacientsData(email);
      console.log(result);
      console.log(result.ClickedTeeth);
      // if (teethRef.current) {
      //   teethRef.current.setTeethStatus(result.phases.ClickedTeeth);
      // }
      setPhases(result.phases || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTreatment = (phaseId, treatment) => {
    console.log("[quantity add treatment]", quantity);

    // Calculate the total using quantity and onePrice
    const total = quantity * parseFloat(treatment.onePrice);

    const newTreatment = {
      ...treatment,
      quantity,
      total,
    };

    console.log(newTreatment);
    setPhases((prevPhases) =>
      prevPhases.map((phase) =>
        phase.id === phaseId
          ? { ...phase, treatments: [...phase.treatments, newTreatment] }
          : phase
      )
    );
  };

  const handleDeleteTreatment = (phaseId, index) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              treatments: phase.treatments.filter((_, i) => i !== index),
            }
          : phase
      )
    );
  };

  const calculateDaysDifference = (start, end) => {
    const diffTime = Math.abs(
      new Date(end).getTime() - new Date(start).getTime()
    );
    console.log("diff", diffTime);
    console.log(
      "AKAVAART",
      start,
      end,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    );

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
  };

  const handleAddPhase = () => {
    const clickedTeethArray = teethRef.current.getClickedTeeth();

    if (clickedTeethArray.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Teeth Selected",
        text: "Please select at least one tooth before adding a phase."
      })
      return
    }

    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "No Dates Selected",
        text: "Please select start and end dates before adding a phase."
      })
      return
    }

    setQuantity(clickedTeethArray.length);
    console.log("[addphase]", clickedTeethArray);

    // if (!newPhaseDays) return;
    const newPhase = {
      id: phaseCounter,
      days: calculateDaysDifference(startDate, endDate),
      startDate: startDate,
      endDate: endDate,
      treatments: [],
      clickedTeeth: clickedTeethArray,
    };
    console.log("newPhase", newPhase);
    setPhases((prevPhases) => [...prevPhases, newPhase]);
    setNewPhaseDays("");
    setClickedTeeth({});
    setStartDate(null); // Reset startDate
    setEndDate(null); // Reset endDate

    if (teethRef.current) {
      teethRef.current.clearTeeth();
    }
    setPhaseCounter((prevCounter) => prevCounter + 1);
  };

  const handleScreenshot = async () => {
    const element = document.getElementById("root"); // Capture the entire app div
    if (!element) {
      console.error("App element not found");
      return;
    }

    const inputs = document.querySelectorAll(".InputsList");
    const patientsDataInputs = document.querySelector(".patientsData");
    const calendar = document.querySelector(".enterDays");
    const btnCollection = document.querySelector(".btnCollection");
    const deleteButton = document.querySelector(".delete-button");

    patientsDataInputs.style.visibility = "hidden";
    calendar.style.visibility = "hidden";
    btnCollection.style.visibility = "hidden";
    if (deleteButton) {
      deleteButton.style.visibility = "hidden";
    }

    setVisibleHeadings(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const removedElements = [];
    inputs.forEach((input) => {
      const parent = input.parentNode;
      const nextSibling = input.nextSibling;
      removedElements.push({ element: input, parent, nextSibling });
      input.remove();
    });

    try {
      const canvas = await html2canvas(element, {
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        scrollX: 0,
        scrollY: -window.screenY,
      });
      const dataUrl = canvas.toDataURL();
      const result = await SaveScreenshot(dataUrl, filename);
      if (result === "No file selected") {
        setVisibleHeadings(false)

      }
      // console.log("[SCREENSHOT RESULT]",result);
    } catch (error) {
      console.error("Failed to take screenshot", error);
    } finally {
      removedElements.forEach(({ element, parent, nextSibling }) => {
        if (nextSibling) {
          parent.insertBefore(element, nextSibling);
        } else {
          parent.appendChild(element);
        }
      });

      patientsDataInputs.style.visibility = "visible";
      calendar.style.visibility = "visible";
      btnCollection.style.visibility = "visible";
      deleteButton.style.visibility = "visible";
      setVisibleHeadings(false);
    }
  };

  const handleSendMail = async () => {
    if (name === "" || email === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Provide With Name and Email",
      });
      return;
    }
    const processedPhases = phases.map((phase) => ({
      ...phase,
      treatments: phase.treatments.map((treatment) => ({
        ...treatment,
        onePrice: parseFloat(treatment.onePrice),
      })),
    }));
    const element = document.getElementById("root");
    if (!element) {
      console.error("App element not found");
      return;
    }
    const canvas = await html2canvas(element, {
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      scrollX: 0,
      scrollY: -window.screenY,
    });
    const dataUrl = canvas.toDataURL();
    console.log("[PROCCESEDPHASES]", processedPhases);
    const data = {
      email,
      name,
      phases: processedPhases,
      dataUrl,
    };
    // console.log("[DATA]", data);
    try {
      const result = await SendMail(data);
      console.log("[SENDMAILRESULT]",result);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your Mail Has Sent Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Failed to send mail", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to send mail",
        text: error.message || "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (!isLoggedIn) {
    return <LoginComponent onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleStoreData = async () => {
    const processedPhases = phases.map((phase) => ({
      ...phase,
      treatments: phase.treatments.map((treatment) => ({
        ...treatment,
        onePrice: parseFloat(treatment.onePrice),
      })),
    }));
    const data = {
      email,
      name,
      phases: processedPhases,
    };
    console.log("[data for storeData]", data);

    if (name === "" || email === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Provide With Name and Email",
      });
      return;
    }

    try {
      const result = await StorePacientsData(data);
      console.log(result);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved in Database",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error storing pacients data: ", error);
    }
    console.log("Data will be stored not right now");
  };

  const handleOnPhaseDelete = (id) => {
    setPhases((prevPhases) => {
      const updatedPhases = prevPhases.filter((phase) => phase.id !== id);

      const reindexedPhases = updatedPhases.map((phase, index) => ({
        ...phase,
        id: index + 1,
      }));

      return reindexedPhases;
    });
  };

  const totalPrice = phases.reduce((total, phase) => {
    return (
      total +
      phase.treatments.reduce(
        (phaseTotal, treatment) => phaseTotal + treatment.total,
        0
      )
    );
  }, 0);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const hasTreatment = phases.some((phase) => phase.treatments.length > 0);
  const firstPhaseStartDate = phases.length > 0 ? phases[0].startDate : "";
  const lastPhaseEndDate =
    phases.length > 0 ? phases[phases.length - 1].endDate : "";

  const buttons = [
    { text: "Take Screenshot", onClick: handleScreenshot },
    { text: "Send Mail", onClick: handleSendMail },
    { text: "Store Data", onClick: handleStoreData },
    { text: "GEL/USD", onClick: handleCurrencyChange },
    { text: "Clear", onClick: handleClear },
  ];

  const getEmailHandler = async (e) => {
    setEmail(e.target.value);
  };

  // if (!isPaid) {
  //   console.log("ARAAGADAXDILI");
  //   return alert("ARAGADAXDILI");
  // }

  return (
    <div id="App">
      {/* <CheckAppVersion /> */}
      <div className="patientsData">
        <div className="pacientsName">Enter Patient's Name and Surname</div>
        <div id="input" className="input-box">
          <input
            id="name"
            className="input"
            onChange={updateName}
            autoComplete="off"
            name="input"
            type="text"
            placeholder="Name"
          />
          <input
            id="email"
            className="input"
            onChange={getEmailHandler}
            name="email"
            type="text"
            placeholder="Email"
          />
          <button className="btn" onClick={greet}>
            Enter
          </button>
        </div>
      </div>

      <div id="result" className="result">
        {resultText}
      </div>
      <div className="content">
        <div className="teethContainer">
          <Teeth onToothClick={handleToothClick} ref={teethRef} />
        </div>

        <div className="enterDays">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
          />

          <button onClick={handleAddPhase}>Add Phase</button>
        </div>
        <div className="treatments">
          {phases.map((phase, index) => (
            <div key={phase.id}>
              <FirstTreatment
                text={`Phase ${index + 1}: Treatment Days: (${
                  phase.days
                } days) Dates: (${formatDate(phase.startDate)} - ${formatDate(
                  phase.endDate
                )})`}
                price={phase.treatments.reduce(
                  (total, treatment) => total + treatment.total,
                  0
                )}
                onDelete={() => handleOnPhaseDelete(phase.id)}
                isGel={isGel}
              />
              <TreatmentInput
                onAddTreatment={(treatment) =>
                  handleAddTreatment(phase.id, treatment)
                }
                quantity={quantity}
                clickedTeeth={phase.clickedTeeth}
                isGel={isGel}
              />
              {visibleHeadings && (
                <Treatments
                  key={"treatmentIndex"}
                  disease={"DESEASE:"}
                  text={"TREATMENT:"}
                  comment={"COMMENT:"}
                  quantity={0}
                  onePrice={"PRICE OF ONE TEETH:"}
                  total={1}
                  clickedTeeth={0} 
                  visibleDeleteButton={false}
                />
              )}
              {phase.treatments.map((treatment, treatmentIndex) => (
                <Treatments
                  key={treatmentIndex}
                  disease={treatment.disease}
                  text={treatment.text}
                  comment={treatment.comment}
                  quantity={treatment.quantity}
                  onePrice={treatment.onePrice}
                  total={treatment.total}
                  clickedTeeth={treatment.clickedTeeth}
                  onDelete={() =>
                    handleDeleteTreatment(phase.id, treatmentIndex)
                  }
                  visibleDeleteButton={true}
                  isGel={isGel}
                />
              ))}
            </div>
          ))}
          {hasTreatment && (
            <FirstTreatment
              text={`Total Days: ${formatDate(
                firstPhaseStartDate
              )} - ${formatDate(lastPhaseEndDate)} `}
              isFinal={true}
              price={totalPrice}
              isGel={isGel}
            />
          )}
        </div>
      </div>
      <ButtonCollection buttons={buttons} />
    </div>
  );
}

export default App;
