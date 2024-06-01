import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS Files/Sheba.css"
import siteIcon from "../../assets/RP_Logo.png"
import { TranslationContext } from "../../Translations/Translation";

const RegisterForm = ({ setLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(""); //error messages
    const navigate = useNavigate();
    const translations = useContext(TranslationContext).translations["RegistrationPages"]["RegisterForm"];

     //journey error code
  function ErrorPopUp ( { text } ) {
    return (
        <div>
            <p className="errorText">{text}</p>
        </div>
    );
}

    const submitHandler = (event) => {
        event.preventDefault();

        // Password length validation
        if (password.length < 8) {
            setError(translations["pw_charlen_error"]);
            return; // Stop the function execution if validation fails
        }

        // Password match validation
        if (password !== confirmPassword) {
            setError(translations["pw_match_error"]);
            return; // Stop the function execution if validation fails
        }

        // Reset error state if pass
        setError("");

        fetch(process.env.REACT_APP_API_PATH + "/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                attributes: {}
            }),
        })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("user", data.userID);
                    setLoggedIn(true);
                    navigate("/registration-upload-picture");
                    window.location.reload();
                } else {
                    // If the response is not ok, attempt to parse the body as JSON for error details
                    try {
                        const errorData = await response.json();
                        setError(errorData.message || translations["email_already_registered"]);
                    } catch (jsonParseError) {
                        setError(translations["email_already_registered"]);
                    }
                    return Promise.reject();
                }
            })
            .catch((error) => {
                console.error('Registration error:', error);
                // Additional error handling or logging can be done here
            })
    };

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/register");
            navigate("/");
        }
    }, []);

    return (
        <div className="registration-container">
            <form className="user-card profileform" onSubmit={submitHandler}>
                <img src={siteIcon} alt="Logo" className="registration-logo" draggable="false"/>
                <h2 className="create-heading">{translations["create_account"]}</h2> 
                    {error? <ErrorPopUp text={error} /> : null}
                    <div className="input-and-label">
                        <label className="edit-profile-label">{translations["email"]} <span className="asterisk">*</span></label>
                        <input
                            type="email"
                            className="edit-profile-input"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="input-and-label">
                        <label className="edit-profile-label">{translations["password"]} <span className="asterisk">*</span></label>
                        <input
                            type="password"
                            className="edit-profile-input"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="input-and-label">
                        <label className="edit-profile-label">{translations["confirm_password"]} <span className="asterisk">*</span></label>
                        <input
                            type="password"
                            className="edit-profile-input"
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    <input className="submit registration" type="submit" value={translations["register"]} />
                 <div className="have-an-account">
                    <p>{translations["already_have_account"]}<Link to="/">{translations["login_here"]}</Link></p>
                </div>
            </form>
               

        </div>
    );
};

export default RegisterForm;









