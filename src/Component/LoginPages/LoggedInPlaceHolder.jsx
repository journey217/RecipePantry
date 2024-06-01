import React, { useEffect, useState, useContext } from "react";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { TranslationContext } from "../../Translations/Translation";

const PseudoLogin = () => {
    const navigate = useNavigate();
    const translations = useContext(TranslationContext).translations["LoginPages"]["LoggedInPlaceholder"];

    function toLogin() {
        navigate("/");
    }

    return (
        <>
            <center>
            <h2 style={{fontStyle: "italic"}}>{translations["functionality_not_implemented"]}</h2>
            <br />
            <button onClick={toLogin} style={{align: "center", fontSize: "24px", fontStyle: "bold", width: "160px", height: "80px", backgroundColor: "#D3D3D3"}}>{translations["go_back"]}</button>
            </center>
        </>
    );
}

export default PseudoLogin