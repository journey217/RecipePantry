import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS Files/Sheba.css";
import siteIcon from "../../assets/RP_Logo.png";
import { TranslationContext } from "../../Translations/Translation";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const translations =
    useContext(TranslationContext).translations.AccountRecovery.ResetPassword;

  //journey error code
  function ErrorPopUp({ text }) {
    return (
      <div>
        <p className="errorText">{text}</p>
      </div>
    );
  }

  const handleResetPassword = (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError(translations["pw_match_error"]);
      return;
    }

    if (newPassword.length < 8) {
      setError(translations["pw_charlen_error"]);
      return;
    }

    fetch(`${process.env.REACT_APP_API_PATH}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: newPassword,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to reset password");
        }
        //check if the response has a body before attempting to parse it as JSON
        return res.text().then((text) => (text ? JSON.parse(text) : {}));
      })
      .then(() => {
        setSuccessMessage(translations["pw_success_redirect"]);
        setError("");
        setTimeout(() => {
          navigate("/");
        }, 4000);
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        setError(translations["pw_reset_fail"]);
      });
  };

  return (
      <div className="registration-container">
          <form className="user-card profileform" onSubmit={handleResetPassword}>
            <img src={siteIcon} alt={translations["logo"]} className="registration-logo" draggable="false"/>
            <h2 className="create-heading">{translations["reset_password"]}</h2>
            {error? <ErrorPopUp text={error} /> : null}
            <div className="input-and-label">
              <label className="edit-profile-label">{translations["code"]} <span className="asterisk">*</span></label>
              <input
                  type="text"
                  className="edit-profile-input"
                  onChange={(event) => setToken(event.target.value)}
              />
            </div>
            <div className="input-and-label">
              <label className="edit-profile-label">{translations["new_password"]}<span className="asterisk">*</span></label>
              <input
                  type="password"
                  className="edit-profile-input"
                  onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="input-and-label">
              <label className="edit-profile-label">{translations["confirm_new_password"]}<span className="asterisk">*</span></label>
              <input
                  type="password"
                  className="edit-profile-input"
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
              />
            </div>
              {successMessage && <div style={{color: 'green', marginBottom: '10px'}}>{successMessage}</div>}
            <input className="submit registration" type="submit" value={translations["reset_password"]}/>
            <Link className="have-an-account" to="/">{translations["back_to_login"]}</Link>
          </form>
      </div>
  );
};

export default ResetPassword;
