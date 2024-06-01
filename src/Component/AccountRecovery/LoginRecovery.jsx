import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS Files/Sheba.css";
import siteIcon from "../../assets/RP_Logo.png";
import { TranslationContext } from "../../Translations/Translation";

const LoginRecoveryForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const translations =
    useContext(TranslationContext).translations.AccountRecovery
      .LoginRecovery;

  //journey error code
  function ErrorPopUp({ text }) {
    return (
        <div>
        <p className="errorText">{text}</p>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === "" || /^\s+$/.test(email)) {
      setError(translations["enter_email_error"]);
      return; // Stop the function execution if validation fails
    }

    setError("");

    // API call to backend to initiate recovery process
    fetch(`${process.env.REACT_APP_API_PATH}/auth/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to initiate recovery process");
        }
        //check if the response has a body before attempting to parse it as JSON
        return response.text().then((text) => (text ? JSON.parse(text) : {}));
      })
      .then((data) => {
        navigate("/reset-password");
      })
      .catch((error) => {
        console.error("Recovery error:", error);
        setError(translations["process_init_fail"]);
      });
  };

  return (
    <div className="registration-container">
      <form className="user-card profileform" onSubmit={handleSubmit}>
        <img
          src={siteIcon}
          alt={translations["logo_alt"]}
          className="registration-logo"
          draggable="false"
        />
        <h2 className="create-heading">{translations["login_recovery"]}</h2>
        {error ? <ErrorPopUp text={error} /> : null}
        <div className="input-and-label">
          <label className="edit-profile-label">
            {translations["account_email"]}
          </label>
          <input
            type="email"
            className="edit-profile-input"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <input
          className="submit registration"
          type="submit"
          value={translations["submit"]}
        />
        <Link className="have-an-account" to="/">
          {translations["back_to_login"]}
        </Link>
      </form>
    </div>
  );
};

export default LoginRecoveryForm;
