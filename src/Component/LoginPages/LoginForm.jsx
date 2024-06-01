import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import siteIcon from "../../assets/RP_Logo.png";
import siteHeader from "../../assets/RP_Header_with_tagline.png";
import phones from "../../assets/cropped-phones.png";
import { TranslationContext } from "../../Translations/Translation";

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [error, setError] = useState(""); // errors
  const navigate = useNavigate();
  const translationContext = useContext(TranslationContext);
  const translations =
    useContext(TranslationContext).translations.LoginPages.LoginForm;

  //journey error code
  function ErrorPopUp({ text }) {
    return (
      <div>
        <p className="errorText">{text}</p>
      </div>
    );
  }

  function toPseudoLogin() {
    // placeholder
    navigate("/pseudologin");
  }

  function toEmptyHandler() {
    // placeholder
    navigate("pseudoPopup");
  }

  function toRegistration() {
    navigate("/register");
  }

  const updateEmail = (input) => {
    setEmail(input);
  };

  const updatePassword = (input) => {
    setPassword(input);
  };

  const submitHandler = (event) => {
    // event.preventDefault() prevents the browser from performing its default action
    // In this instance, it will prevent the page from reloading
    // keeps the form from actually submitting as well
    event.preventDefault();

    /*if (!sessionStorage.getItem(email)) { // if email not extant
      setError("That email is not associated with a Recipe Pantry account.");
      return;
    }*/

    /*if (password.length < 8) {
      setError("This can't be a password; it's too short.");
      return;
    }*/

    // blank email
    if (email === "" || /^\s+$/.test(email)) {
      setError(translations["enter_email"]);
      return; // Stop the function execution if validation fails
    }
    // blank password
    if (password === "" || /^\s+$/.test(password)) {
      setError(translations["enter_password"]);
      return; // Stop the function execution if validation fails
    }

    setError(""); // ensuring no error if passing checks

    fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        /*if (!result.userID) {
          // Unsuccessful log in
          console.log(result);
          setError("Invalid login credentials")
        }*/
        if (result.userID) {
          // Successfully logged in
          // console.log(result);
          // set the auth token and user ID in the session state
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("user", result.userID);
          // call setLoggedIn hook from App.jsx to save the login state throughout the app
          setLoggedIn(true);
          setSessionToken(result.token);
          // console.log(sessionToken, " SESSION TOKEN");
          // go to the homepage
          //navigate("/profile");
          //navigate("/");
          window.location.reload();
        } else {
          // do nothing
        }
      })
      .catch((err) => {
        /*if (email === "" && password === "") {
          setError("You've left both fields empty...");
        } else if (email === "") {
          setError("Please enter an email.");
        } else */
        setError(translations["invalid_credentials"]);

        //return Promise.reject();
        console.log("Login error:", err);
      });
  };

  const emptyFields = (click) => {
    click.preventDefault();

    if (
      email === "" ||
      email === null ||
      password === "" ||
      password === null
    ) {
      toEmptyHandler(); // failing error check
      //return (
      //  <div styles={{textAlign: "center", width: "500px", height: "220px", borderRadius: "10px"}}><div><p>You've left 1 or more fields empty!</p></div></div>
      //);
    } else {
      //login();
      //toPseudoLogin(); // passing error check
      //submitHandler();
    }
  };

  return (
    <div className="registration-container2">
      <div className={"phones_and_form_container"}>
        <div className={"phones_container"}>
          <img
            src={phones}
            alt={translations["phone_screenshots_alt"]}
            className={"phones_image"}
            draggable="false"
          />
        </div>
        <div className={"form_wrapper"}>
          <div className={"logo_container"}>
            <div className={"image_logo_container"}>
              <img
                src={siteHeader}
                alt={translations["logo_alt"]}
                className="site_title2"
                draggable="false"
              />
            </div>
          </div>
          <div className={"form_wrapper2"}>
            <form className="user-card2 profileform2" onSubmit={submitHandler}>
              <h2 className="create-heading">{translations["log_in"]}</h2>
              {error ? <ErrorPopUp text={error} /> : null}
              <div className="input-and-label">
                <label className="edit-profile-label">
                  {translations["email"]} <span className="asterisk">*</span>
                </label>
                <input
                  type="email"
                  className="edit-profile-input"
                  // style={{position: "absolute", left: "700px"}}
                  // event.target refers to the DOM that is triggered from an event, such as onChange, onClick, etc.
                  // event.target.value holds the value that is passed in to the input field from the onChange
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={translations["email_address"]}
                />
              </div>

              <div className="input-and-label">
                <label className="edit-profile-label">
                  {translations["password"]} <span className="asterisk">*</span>
                </label>
                <input
                  type="password"
                  className="edit-profile-input"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={translations["password"]}
                />

                <p className="forgot">
                  <Link to="/login-recovery">
                    {translations["forgot_password"]}
                  </Link>
                </p>
              </div>

              <input
                className="submit registration"
                type="submit"
                value={translations["log_in"]}
              />

              <div className="have-an-account">
                <p>
                  {translations["don't_have_account"]}
                  <Link to="/register">
                    {translations["create_account_here"]}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
