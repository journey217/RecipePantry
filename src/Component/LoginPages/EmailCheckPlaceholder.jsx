import React, { useEffect, useState, useContext } from "react";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import dog from "../../assets/dog.jpg";
import { TranslationContext } from "../../Translations/Translation";

const PseudoPopup = () => {
    const navigate = useNavigate();
    const translations = useContext(TranslationContext).translations["LoginPages"]["EmailCheckPlacholder"];

    function toLogin() {
        navigate("/");
    }

    return (
        <>
            <center>
            <h2>{translations["fields_empty"]}</h2>
            <img src={dog} style={{height: "450px", width: "450px"}}></img>
            <br /> <br/>
            <button onClick={toLogin} style={{align: "center", fontSize: "24px", fontStyle: "bold", width: "160px", height: "80px", backgroundColor: "#D3D3D3"}}>{translations["try_again"]}</button>
            </center>
        </>
    );
}

export default PseudoPopup;