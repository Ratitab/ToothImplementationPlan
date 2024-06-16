import React, { useState } from 'react';
import teethSvg from './assets/images/tooth.png';
import dentalImplant from './assets/images/dental-implant.png';
import './teeth.css';

const Teeth = ({ onToothClick }) => {
    const [screws, setScrews] = useState({});
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleToothClick = (number, event) => {
        event.stopPropagation();
        const rect = event.target.getBoundingClientRect();
        const containerRect = event.currentTarget.getBoundingClientRect();
        const x = rect.left - containerRect.left + window.scrollX;
        const y = rect.top - containerRect.top + window.scrollY;
        setPosition({ x, y });
        setScrews((prevScrews) => {
            if (prevScrews[number]) {
                const updatedScrews = { ...prevScrews };
                delete updatedScrews[number];
                return updatedScrews;
            } else {
                return { ...prevScrews, [number]: { x, y } };
            }
        });
        onToothClick(number)
    };

    return (
        <div className="teethContainer">
            <div className="upper-teeth">
                {[17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27].map((number) => (
                    <div key={number} onClick={(e) => handleToothClick(number, e)}>
                        {screws[number] && (
                            <div className="screw" style={{ top: screws[number].y, left: screws[number].x }}>
                                <img src={dentalImplant} alt="screw" width={40} />
                            </div>
                        )}
                        <img src={teethSvg} width={60} alt="tooth" />
                        <p>{number}</p>

                    </div>
                ))}
            </div>
            <div className="bottom-teeth">
                {[47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36].map((number) => (
                    <div key={number} onClick={(e) => handleToothClick(number, e)}>
                        {screws[number] && (
                            <div className="screw" style={{ top: screws[number].y, left: screws[number].x }}>
                                <img src={dentalImplant} alt="screw" width={40} />
                            </div>
                        )}
                        <p>{number}</p>
                        <img src={teethSvg} width={60} alt="tooth" />

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teeth;
