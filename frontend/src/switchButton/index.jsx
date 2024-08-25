import { useState } from "react";
import ReactSwitch from "react-switch";

const sizePresets = {
    sm: { height: 16, width: 32, handleDiameter: 14 },
    md: { height: 20, width: 40, handleDiameter: 1 },
    lg: { height: 24, width: 48, handleDiameter: 22 },
    xl: { height: 28, width: 56, handleDiameter: 26 },
    '2xl': { height: 32, width: 64, handleDiameter: 30 },
  };

const SwitchButton = ({size = "md"}) => {
    const [isChecked, setIsChecked] = useState(false)

    const handleSwitch = (checked) => {
        setIsChecked(checked)
    }

    const handleStyle = {
        width: `${sizePresets[size].handleDiameter}px`,
        height: `${sizePresets[size].handleDiameter}px`,
      };


  return (
    <div>
      <ReactSwitch
        onChange={handleSwitch}
        checked={isChecked}
        size={2}
        offColor="#888"
        onColor="#007bff"
        uncheckedIcon={"₾"}
        checkedIcon={"$"}
        height={12}          // Set the height of the switch
        width={48}           // Set the width of the switch
        handleDiameter={0} // Using this to pass the diameter (if supported)
        handleStyle={handleStyle} // Set the diameter of the handle
      />
    </div>
  );
};

export default SwitchButton;
