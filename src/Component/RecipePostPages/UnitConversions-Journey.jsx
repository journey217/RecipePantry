import React, {useState, useContext} from "react";
import "../../CSS Files/Journey.css";
import { TranslationContext } from "../../Translations/Translation";

const UnitConversions = ( { closeConversions, showConversions } ) => {
    const translations = useContext(TranslationContext).translations.Conversions;
    const [convertFrom, setConvertFrom] = useState(translations["Teaspoon"]);
    const [convertTo, setConvertTo] = useState(translations["Teaspoon"]);
    const [inputValue, setInputValue] = useState(0);
    const handleClose = (e) => {
        closeConversions && closeConversions(e);
    };

    function ErrorPopUp ( { text } ) {
        return (
            <div>
                <p className="errorText">{text}</p>
            </div>
        );
    }

    function convertCookingMeasurement(value, fromUnit, toUnit) {
        // Define conversion rates
        const conversionRates = {
            "Cup": {
                "Tablespoon": 16,
                "Teaspoon": 48,
                "Cup": 1
            },
            "Tablespoon": {
                "Cup": 1/16,
                "Teaspoon": 3,
                "Tablespoon": 1
            },
            "Teaspoon": {
                "Cup": 1/48,
                "Tablespoon": 1/3,
                "Teaspoon": 1
            },
            "杯": {
                "汤匙": 16,
                "茶匙": 48,
                "杯": 1
            },
            "汤匙": {
                "杯": 1/16,
                "茶匙": 3,
                "汤匙": 1
            },
            "茶匙": {
                "杯": 1/48,
                "汤匙": 1/3,
                "茶匙": 1
            }
        };

        // Check if the units are valid
        if (!conversionRates[fromUnit] || !conversionRates[fromUnit][toUnit]) {
            console.log("fromUnit",fromUnit);
            console.log("toUnit", toUnit);
            console.log("Invalid units.");
            return null;
        }

        // Convert the value to the target unit
        return value * conversionRates[fromUnit][toUnit];
    }

    function handleConversion(event) {
        event.preventDefault();
        const ans_space = document.getElementById("conversion_answer");
        const converted = convertCookingMeasurement(inputValue, convertFrom, convertTo);
        if (converted <= 0) {
            ans_space.innerHTML = "<center><p style='width: 80%' class='errorText'>"+translations['Please input a value >0']+"</p></center>"
        } else {
            ans_space.innerHTML = "<h3>" + parseFloat(inputValue) + " " + translations[convertFrom] + translations["is equal to"] + converted + " " + translations[convertTo] + translations["(s)."] + "</h3>"
        }
    }

    if (!showConversions) {
        return null;
    }

    return (
        <div className={"darkend_background"}>
        <div className="unit_conversions_pop">
                <button onClick={handleClose} className="x_button">X</button>
                <br/>
                <div className="conversion_inputs">
                    <form className="unit_conversion_form" onSubmit={handleConversion}>
                        <br/>
                        <br/>
                        <label>
                            {translations["Convert From"]} <span className="asterisk">*</span>{'\t'}
                            <select className={"tabs_index"} onChange={(e) => setConvertFrom(e.target.value)}>
                                <option value={"Teaspoon"}>{translations["Teaspoon"]}</option>
                                <option value={"Tablespoon"}>{translations["Tablespoon"]}</option>
                                <option value={"Cup"}>{translations["Cup"]}</option>
                            </select>
                        </label>
                        <br/>
                        <br/>
                        <label>
                            {translations["Convert To"]} <span className="asterisk">*</span>{'\t'}
                            <select onChange={(e) => setConvertTo(e.target.value)}>
                                <option value={"Teaspoon"}>{translations["Teaspoon"]}</option>
                                <option value={"Tablespoon"}>{translations["Tablespoon"]}</option>
                                <option value={"Cup"}>{translations["Cup"]}</option>
                            </select>
                        </label>
                        <br/>
                        <br/>
                        <label>
                            {translations["Amount"]} <span className="asterisk">*</span>{'\t'}
                            <input className={"unit_conv_input"} onChange={(e) => setInputValue(e.target.value)} type="number" name="amount" />
                        </label>
                        <br/>
                        <br/>
                        <button className="convert_button" type="submit">{translations["Convert"]}</button>
                    </form>
                </div>

            <div id={"conversion_answer"}>
            </div>
            </div>
            </div>
    );
};

export default UnitConversions;